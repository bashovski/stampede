<p align="center">
  <img alt="Stampede" src="ui/src/assets/logo.svg" />
</p>

<p align="center">
<a href="https://travis-ci.com/bashovski/stampede">
  <img src="https://travis-ci.com/bashovski/stampede.svg?token=gvKx1eGwSBqqzCwcmAZz&branch=master" alt="Build Status" />
</a>
<a href="https://img.shields.io/badge/license-MIT-%23339933"><img src="https://img.shields.io/badge/license-MIT-%23339933" alt="License"></a>
<a href="https://img.shields.io/github/contributors/bashovski/stampede?color=%23011762"><img src="https://img.shields.io/github/contributors/bashovski/stampede?color=%23011762" alt="Contributors"></a>
</p>

# Stampede 🦕

- To see the source code of Stampede CLI, check https://github.com/bashovski/stampede-cli

# About
- Stampede is a framework, or an eco-system written in TypeScript for Deno, made with emphasis on delivering new features quicker than ever before.

## Features

- CLI - generate modules instantly and make progress without fuss!
- Convenient M(V)CS structure - strong emphasis on separation of concerns
- Autowired modules and loaders - implicitly run codebase without piling up large imports
- Authentication system ready for use
- Modified Koa Router utilization - easy-to-use Routing, HTTP request handlers, etc.
- Deployment configuration which is production-ready
- View layer written in Vue.js - includes auth pages, guards, etc.
- DenoDB ORM along with PostgreSQL
- Pre-written migrations with Umzug and Sequelize (there's raw SQL as well)
- Feature Flags - toggle which features should be running even during server runtime
- Autowired config - adding and consuming environment variables kept elegant
- Multi-level logger with DataDog support (allows usage of facets and tags)
- Custom Mail module/internal micro-library compatible with SendGrid
- Validators - validate and restrict invalid user input with large variety of options
- Factories - populate your database with false records (powered by faker.js)
- Route Guards for your Vue SPA - modify the behavior of page access layer the way you want to
- Autowired CRON jobs
- Unit tests with bootstrappers
- Insomnia and Swagger doc for existing REST API endpoints
- and many more...

## Requirements

| Service    | Min. version |
|------------|--------------|
| Deno       | 1.3.0        |
| V8         | 8.6.334      |
| TypeScript | 3.9.7        |
| Node¹      | 12.6.3       |
| NPM¹       | 6.14.4       |

¹ - Not mandatory, used only for migrations with Umzug.

## Installation

- Clone the repository:<br/>
```shell script
git clone https://github.com/bashovski/stampede
``` 

- Cd into the project directory:<br/>
```shell script
cd stampede
```
- Create ```.env``` file using ```.env.example``` as a base:<br/>
```shell script
cp .env.example .env
```
- Update environment variables in .env file. (DB_*) fields are mandatory.<br/>
You can, but you don't have to set up local PostgreSQL Docker container for dev purposes as it's very easy to use by running:
```shell script
docker run --name stampede-project-db -e POSTGRES_PASSWORD=your_db_password -d -p 5432:5432 postgres
```
If you already have Postgres service up and running, you can avoid the command above.<br/>
- In order for programmatic migrations to be ran, please install Node dependencies: ```npm i```
- Once they are installed, execute the run command to start up the server: 
```shell script
./scripts/run
```
- Your server will be up and running now.
- After booting the server, you can serve UI written in Vue.js:
- Open a separate terminal window/tab and run the command from root project directory: 
```shell script
cd ui && npm i
npm run serve
``` 

You can normally run the UI serve script once you have dependencies installed for it:
```shell script
./scripts/ui # From root project directory
``` 

- By default, the server will be accessible at: ```http://localhost:80/```, <br/>
and the UI will be accessible from ```http://localhost:8080```

- Now, as you have both the server and client up and running, 
feel free to read how Stampede works and check out some of the tutorials and blogs!

## Models
- Each table in a database has a corresponding model.
- Using DenoDB ORM, you may apply mutations to the model's instances, persist new records, or remove them from the database.
- We can view models as blueprints for certain objects we want to store and consume in our application.

- Using Stampede CLI, you can easily create new model: ```stampede model Video``` - creates Video.ts model in ```models/``` directory.

- Let's take a look at an example of a well-structured model:

```typescript
import { DataTypes } from 'https://raw.githubusercontent.com/eveningkid/denodb/abed3063dd92436ceb4f124227daee5ee6604b2d/mod.ts';
import Model from '../lib/Model.ts';

class Video extends Model {

    static table = 'videos'; // Name of the table in DB
    static timestamps = true; // Enables created_at and updated_at columns

    // We'll keep it simple, here are a couple of fields related to the model:
    // For more info regarding usage of DenoDB ORM: https://eveningkid.github.io/denodb-docs/
    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            length: 256,
            allowNull: false
        },
        channelId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };
}

export default Video;
```
- That'd be a very basic model example. In order for the model metadata to be appended to a database, you'll need to
create a migration, and assure each field is present in the migration. Please read the 'Migrations' section below.

## Routing
- Once you create a model using CLI, you also create a routing for that model. Routings can always be independent of the model, and therefore
do not need to have any association with any model whatsoever. It is advisable to follow the Pascal-case naming convention of modules - e.g. ```ModelRouting.ts```.

As we mentioned earlier, Stampede utilizes Koa router which offers many functionalities and in this case, we'll explain proper usage of routes.
Let's use a small chunk of UserRouting.ts:

```typescript
/*
 * To follow the convention, HTTP requests are being handled by controllers. That's why we are using UserController here.
 * UserController will consume the context argument - passed required headers and sent data to a service (in this case UserService).
 * UserService will process passed data, perhaps update the database and return the response (ServiceResult).
 * Once controller receives response (ServiceResult), it will most likely send the response to the client.
 */
import Router from '../lib/Router.ts';
import UserController from '../controllers/UserController.ts';
import AuthMiddleware from '../middleware/AuthMiddleware.ts';
import HttpResponse from '../http/HttpResponse.ts'; // Only used for last example

/**
 * Now, let's take a look at the login request:
 * Notice how we only require the Router.post function to invoke UserController.loginUser and nothing else.
 * The loginUser function will handle the sending of response and controller -> service transaction prior to that.
 */
Router.post('/users/login', UserController.loginUser);

/**
 * In this example, we want to fetch current user's information - such as username, date of birth, avatar, etc.
 * In order to achieve that, we need to primarily assure that the client which sends the request is authenticated user.
 * Now notice that we are using AuthMiddleware.authenticateUser method before retrieving user's info (IAM).
 * In this case, AuthMiddleware.authenticateUser behaves as a middleware and checks if there's a session with passed session cookie.
 * Obviously, if the cookie isn't passed or if the session with corresponding cookie has expired, the authentication will fail,
 * therefore the user won't be allowed to retrieve their data since service won't be able to identify the user with no linked session.
 */ 
Router.get('/users/iam', AuthMiddleware.authenticateUser, UserController.IAM);

/**
 * Let's take a look at another example, which is pretty much straight-forward:
 * Note that the controller functions are usually like the arrow function below.
 * They obviously consume the ctx argument from which many things can be derived,
 * including headers, query params, request body, cookies, etc.
 *
 * In the example below we are creating an instance of HttpResponse and passing two arguments:
 * first arg: status code
 * second arg: body of the response
 *
 * We use the HttpResponse's send() method which consumes response from context and that's it!
 */
Router.get('/users/count', (ctx: any) => {
    new HttpResponse(200, {
        message: 1000 // trivial
    }).send(ctx.response);
});
```

## Controllers
- Controllers are responsible for handling HTTP requests and sending adequate responses derived from services to a client.
- We differentiate two types of responses returned by services: a HttpResponse and a HttpError.
- Both of them are very similar and in fact, HttpError as a class extends HttpResponse.
- The emphasis here is on semantics, therefore instance of HttpError class may only have status code which is identified as error status code (400-599).

- To generate a controller, you can use Stampede CLI: ```stampede ctrl Profile``` - creates ProfileController.ts
- You may also provide more controller names as command arguments simultaneously: ```stampede ctrl Profile Story Post Follower```

- Let's examine an example of a controller:

```typescript
import Controller from './Controller.ts';
import PostService from '../services/PostService.ts';
import Logger from '../lib/Logger.ts';

/**
 * @class PostController
 * @summary Handles all Post-related HTTP requests
 */
class PostController extends Controller {

    /**
     * @summary Handles index request
     * @param ctx
     */
    static async index(ctx: any): Promise<void> {
        try {

            /*
             * Notice how we destructure the service result. As we mentioned, controller only consumes 
             * request headers and sent data, as well as the service result which acts as response.
             * 'response' is an instance of HttpResponse class and holds a status code and response body.
             * An instance of HttpResponse also can hold a cookie which will be set on client later.
             * HttpError extends HttpResponse, hence send() method would work on both of them.
             * 
             * Also notice that we are using PostService which you'll also need to create.
             * Service basically contains logic and data tier: https://en.wikipedia.org/wiki/Business_logic#/media/File:Overview_of_a_three-tier_application_vectorVersion.svg
             * Check the 'Services' section below to have better understanding of services.
             */
            const { response, error } : any = await PostService.index();
            (response || error).send(ctx.response); // Sends a response to the client (response if successful, otherwise sends an error with adequate status code)

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }
}

/**
 * @exports PostController
 */
export default PostController;
```

## Services

- Services are handling business logic and are the most important part of your next project made with Stampede.
- As services are receiving sent request's payload, they are responsible for validating, processing, and applying CRUD operations to the data.
- Each function from the service which correlates to another controller, and a correlation method from service should return an instance of ServiceResult.
- Let's quickly take a look at ServiceResult:

```typescript
export interface ServiceResult {
    response?: HttpResponse,
    error?: HttpError,
    cookie?: any
}
```

- From the example above, we can notice that none of the properties are mandatory, although the request's response won't be sent back to the client
if both response and error are missing. One of them must be included.
- Both HttpResponse and HttpError classes have same constructor arguments as HttpError inherits HttpResponse.
- In the example below, we will fetch and return all posts (derivation of Post model) from the database.

```typescript
import Service, { ServiceResult } from './Service.ts';
import HttpResponse from '../http/HttpResponse.ts';
import Post from '../models/Post.ts';

class PostService extends Service {

    /**
     * @summary Index of all Post REST resources
     * @param data
     * @returns object
     */
    static async index(data : any): Promise<ServiceResult> {
        return {
            const posts: Array<Post> = await Post.all();
            response : new HttpResponse(200, {
                message: 'Hello friend!',
                posts
            })
        };
    }
}

export default PostService;

```

## CORS

- In order to assure your API allows requests from different origins, you may need to update ```origins.yaml``` file from ```/http``` directory.
- Stampede uses pre-written loader to whitelist specified origins under the hood. Refer to ```YamlParser.ts``` and ```HttpOriginReader.ts```.

```yaml
# Whitelist of origins
allowed:
    - "http://localhost:8080"
    - "https://example.org"
```

## Mails

- Stampede comes with its own Mail module. It utilizes SendGrid to provide easily customizable dynamic templates and make mail sending easier than never before. 

```javascript
import Mail, { MailSenderRecipient } from './lib/Mail.ts';

const mail: Mail = new Mail({
    subject: 'A subject',
    templateId: '<TEMPLATE ID HERE>',
    dynamicTemplateData: {
        name: 'Jane Doe',
        location: 'Newark, NJ'
    }
});

const sender: MailSenderRecipient = {
    name: 'John Doe',
    email: 'johndoe@example.org'
}

const recipient: MailSenderRecipient = {
    name: 'Jane Doe',
    email: 'janedoe@example.org'
};

await mail.from(sender).to(recipient).send();
```
- Both ```.from()``` and ```.to()``` methods support a single MailSenderRecipient and an array of MailSenderRecipients. 
- Whilst using dynamic templates, ```subject``` and ```content``` opts would be overriden.
- When passing a timestamp to ```sendAt (serialized: send_at)```, make sure that the value is a UNIX timestamp (integer) and its unit is in seconds (not ms which is by default).
- Usage of Mail module requires ```SENDGRID_API_KEY``` environment variable to be present. It can be retrieved by invoking ```Config.getSendGridApiKey()```.

## Logger

- Stampede's logger extends already very powerful Deno's logger. It's been primarily extended to achieve different types of log transport, such as rolling log and integration with external log monitoring services like DataDog. This logger easily allows log transport to DataDog.

- In order to instantiate log sending to DataDog, you'll need to assign environment variable ```SENDGRID_API_KEY``` a correct API key as a value.
- The logger is easily customizable and it allows process/log facets to be sent along with the log. They become very useful in complex processes where comprehensive, informative instrumentation is very important to easily maintain, modify and improve code to become bug-free.

```javascript
import Logger from './lib/Logger.ts';

Logger.info('A info log.');
Logger.debug('A debug log.');
Logger.warning('A warning.');
Logger.error('An error log.');
Logger.critical('A critical error log.');

// Log a file while sending facets to DataDog:
const email = 'example@example.org';
const username = 'bashovski';

// The second passed parameter are the log facets.
Logger.info('Log message goes brrr', {
    email,
    username
});

```

## Autowiring and Loaders

- Stampede relies quite a lot on modules named 'Loaders'. Loaders are quite instrumental when it comes to providing each part of code
without having to explicitly import them where they are needed. Loaders are only used in situations where there are multiple modules
that require import and invoking of their certain method in order for the server to function normally.

- Loaders have both pros and cons. They do allow you to import everything implicitly which saves you lines of code and simplifies the
process of adding new features. The only problem with having this type of module importing is that you need to assure that you do not have
any corrupted modules which could impact the server workflow in the end.

## Adding and consuming Environment variables

- Navigate into directory ```/config```
- Create a new file with semantic name if needed, or extend already existing ones
- Simply add new prop/value, e.g. ```favoriteDinosaur: 'FAVORITE_DINOSAUR'```
- Add value of the environment variable in .env: ```FAVORITE_DINOSAUR="T-Rex"```
- Import Config in a module in which you are planning to consume any environment variable, e.g. ```import Config from '../lib/Config.ts'```
- You can now access that env variable by invoking ```Config.getFavoriteDinosaur()```

## Route Guards

- As already mentioned in 'Middleware' section, requests can be easily protected from unauthorized requests, although there's a different
philosophy for frontend part, when it comes to guarding specific routes.

- In the code sample below, we can notice how easy it is to guard routes. Usually there would be two mostly-used cases: 
to only allow access to authenticated users and to disallow the authenticated users the access to specific route.

```ui/src/router/index.ts```:
```typescript
enum Guard {
    RequiresAuth, // Authentication required for this route
    NoAuth, // User mustn't be authenticated whilst navigating to this route
    Universal // Not required in case there's no guard for a route
}

const routes: Array<RouteConfig | any> = [
    {
        path: '/protected-route',
        name: 'ProtectedRoute',
        component: () => import('@/views/ProtectedView.vue'),
        guardType: Guard.RequiresAuth // Protects the route from unauthenticated users
    },
    // ... 
]
```

## Migrations

- Stampede is using Sequelize's Umzug by default, as the amount of libraries for migrations in Deno is very low and they are very unreliable.
- As you may know, DenoDB, an ORM Stampede uses, has built-in functionality which updates the database, but it, unfortunately, has many flaws.
- In order to provide stability and consistency to the codebase, it was the only correct choice, as deno-nessie migration library uses different terminology.

- Each migration should have ```up()``` and ```down()``` methods, and the naming should just follow ASCII ordering for migrations to be executed.
- To toggle migrations at server boot-up, update feature flag ```runMigrationsOnBoot``` in ```feature_flags.yaml```.
- Please note that the migrations won't be executed in case the server is started manually, without using CLI or ```/scripts/run``` script.
- DenoDB and Sequelize's Umzug use very similar terminology, hence consistency is guaranteed.

## Tests

- Stampede also comes with unit tests.
- Each test, in order to achieve successful connection to the database and other miscellaneous setup parts, needs to use bootstrappers.
- Deno enforces all asynchronous operations to be either finished or closed before the test termination, hence it is advisable to invoke:
```javascript 
await Db.close();
```
to assure the database connection is terminated. You won't need to use that if you are adding tests for features which do not use database connection.

- To run tests, run: ```./scripts/test```.

- For tests which contain unterminated asynchronous operations that cannot be easily terminated, you can use:
```typescript
Deno.test({
    name: 'Your test name',
    fn: async () => { /* Your asynchronous function's code here */ },
    sanitizeOps: false,
    sanitizeResources: false
});
```
- Usually, disabling the sanitization of operations and resources would be probably used when having loggers sending log messages through HTTP transport.
- That's not the only case, as you'll be adding your own code which could possibly affect that. Keep in mind that it's bad practice to use it when you don't need to.

- You can also easily isolate/skip tests if certain features are disabled:

```javascript
import FeatureFlags from '../lib/FeatureFlags.ts';

if (!FeatureFlags.isFeatureEnabled('yourFeature'))
    return console.log('Skipping test for your feature since it has been disabled.');
```

## Validator
- Stampede comes with a powerful validator module to easily handle invalid user input.
- Here's the list of currently available validator options:

| Key       | Option Type       | Description                                                                                                                                              |
|-----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| minLength | number            | Applies a minimum accepted length of passed string                                                                                                       |
| maxLength | number            | Applies a maximum accepted length of passed string                                                                                                       |
| regExp    | RegExp or  string | Applies a regular expression where the passed string needs to match its pattern                                                                          |
| unique    | Model             | Originally accepts a Model. If false, won't perform any checking (can be omitted as well).  Checks if passed property's value is unique in the database. |
| required  | boolean           | Allows nullable values, but not the undefined ones                                                                                                       |
| email     | boolean           | If true, passed string must be an email                                                                                                                  |
| uuid      | boolean           | If true, passed string must be an UUIDv4                                                                                                                 |
| includes  | any               | Please note that this is case-sensitive. Transform the field value and all array elements to lowercase and then compare them if needed.                  |
| excludes  | any               | Please note that this is case-sensitive. Transform the field value and all array elements to lowercase and then compare them if needed.                  |
| notIn     | Array<any>        | Checks if an object, or a value isn't an element of an array                                                                                              |
| in        | Array<any>        | Checks if an object, or a value is an element of an array                                                                                                 |
| equals    | any               | Checks if passed value equals expected one's                                                                                                             |
| between   | Array<number>     | Requires a passed value not to be higher or lower than the boundary values (e.g. [1, 10])                                                                |
| gt        | number            | Checks if passed value is greater than expected value                                                                                                    |
| gte       | number            | Checks if passed value is greater than or equals the expected value                                                                                      |
| lt        | number            | Checks if passed value is lower than the expected value                                                                                                  |
| lte       | number            | Checks if passed value is lower than or equals the expected value                                                                                        |

- Stampede has a test for the Validator module: ```tests/validator_test.ts``` which does basic data validation as well as the
uniqueness checking for the user model.

- Please also note that the ```Validator.validate(rules, body)``` is an asynchronous function which immediately checks for all fields
in order to provide better user experience in the end in case the validation errors are being displayed directly to the users. If that's
not the case, again, count of invalid fields can be extremely useful in many cases. If it's not needed in your case, you can simply just consume the
success var which is sufficient anyways. 

- Here's a good example showing proper usage of the Validator:

```typescript
import Validator, { ValidationRules } from '../lib/Validator.ts';

const rules: ValidationRules = {
    id: {
        required: true,
        uuid: true
    },
    username: {
        required: true,
        regExp: /^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$/
    },
    email: {
        required: true,
        email: true
    },
    currentWatch: {
        in: ['Datejust', 'Seamaster', 'Nautilus', 'Yachtmaster', 'Radiomir', 'Monaco', 'Santos Dumont']
    },
    secretNumber: {
        between: [200, 400]
    }
};

// Could easily be a HTTP request's body - deserialized JSON
const body = {
    id: 'cf18b235-4643-4233-93a7-fbe3d0172d4a',
    username: 'test_username',
    email: 'test@example.com',
    currentWatch: 'Nautilus',
    secretNumber: 250
};

// You can always return invalidFields in HTTP request's response, since they can easily be shown in UI.
const { success, invalidFields } = await Validator.validate(rules, body);
```

## CRON Jobs
- All CRON jobs should be placed inside ```/cron``` directory.
- Stampede uses deno_cron: https://github.com/rbrahul/deno_cron

- Each CRON job module should be a class and should be named by following these rules:
1. The name of the class and the file should be same and should be in Pascal-case.
2. Each CRON job's entry point is a static ```schedule()``` function. That function will be automatically executed.

## Cookies
- Using Oak (https://github.com/oakserver/oak), it's easy to set and retrieve HTTP cookies.
- Stampede by default uses only one cookie to store user sessions. It's a HTTP cookie, whose options can be easily changed to make it even more prohibitive.
- To retrieve the session cookie name, you can invoke ```Config.getSessionCookieName()```. Prior to that, import the Config module from ```/lib```.
- It'd be good to have cookie names stored somewhere as constants, parts of enum or ideally, to store cookie names in ```.env```.
- By convention, you should access or mutate client's cookie state in controllers. 
- To access cookies inside handler functions in controllers, invoke something similar to this: ```ctx.cookies.get(Config.getSessionCookieName())```.
- Here's an example on setting new cookies:

```/controllers/UserController.ts```:
```typescript
    /**
     * @summary Handles login request
     * @param ctx
     */
    static async loginUser(ctx: any): Promise<void> {
        try {

            const { response, cookie, error } : any = await UserService.loginUser(await (ctx.request.body().value));

            if (cookie) ctx.cookies.set(cookie.getName(), cookie.getValue(), cookie.getOptions());

            (response || error).send(ctx.response);

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }
```

- As we mentioned above, methods from services which correlate to controller methods, should return ServiceResult, which includes cookie as one of the properties.
- To conventionally create a new cookie, you can import Cookie class from ```/lib/Cookie.ts``` and create an instance of it.

- Here's an interface including all cookie options:

```typescript
interface CookieOptions {
    domain : string,
    sameSite : string,
    expires : Date,
    secure : boolean,
    path : string
}
```
- To create a cookie, you'll pass three arguments: name, value and options (CookieOptions).
- Here's an example from ```/models/Session.ts```:
```typescript
    public getCookie(): Cookie {

        const isDev = Config.getEnvironment() === 'dev';
        const expires = moment().add(31, 'days').toDate();

        // @ts-ignore
        return new Cookie(Config.getSessionCookieName(), this.token, isDev ? {
            expires,
            path: '/'
        } : {
            domain: Config.getApiUrl(),
            sameSite: true,
            expires,
            secure: true,
            path: '/'
        });
    }
```

## Factories
- Factories represent an option to easily populate the database with false records.
- Stampede utilizes ported version of Faker.js and factories are quite straight-forward when it comes to writing and executing them.
- Note that they aren't standalone and are being executed as a part of server initialization process.
- To toggle factories, update feature_flags.yaml: ```runFactoriesOnBoot: true/false```

- You can create factories using CLI: ```stampede factory ModelName```.
- They are located in ```/db/factories``` directory and are easy to configure.
- You can pass both functions and defined values in factories, meaning that the functions will be executed during iterations
which will result in n number of possibly different values.

- All Factory options are mandatory and once passed as a parameter of Factory object, should have type of FactoryOptions.
- Structure of FactoryOptions:

```typescript
export interface FactoryOptions {
    model: any, // Must inherit Model class: /lib/Model.ts
    persistenceCount: number, // Amount of records to be persisted to DB
    fields?: any // Model's equired fields are the bare minimum
}
```

- Here's an example of a factory:

```typescript
import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/mod.ts";

import Factory, { FactoryOptions } from '../../lib/Factory.ts';
import User from "../../models/User.ts";

/**
 * @summary Populates 'users' table with false records
 * @class UsersFactory
 */
class UsersFactory extends Factory {
    constructor() {
        const options: FactoryOptions = {
            model: User,
            persistenceCount: 100,
            fields: {
                id: faker.random.uuid,
                email: faker.internet.email,
                username: faker.internet.userName,
                password: '123456789',
                dateOfBirth: new Date('1-1-1990'),
                isVerified: false
            }
        };
        super(options);
    }
}

export default UsersFactory;
```
- Notice how we aren't executing the functions in the example above. Instead, we are passing them entirely and later executing them by invoking ```factory.populate()```

## Encryption
- Stampede at the moment only provides password encryption (utilizes Bcrypt).

## Dependencies
- ```deps.ts``` file is still an option to have centralised module for dependencies, although at the moment it is not being used.

## Deployment
- Currently, Stampede comes with Docker and TravisCI configuration, made for more fluid collaboration on GitHub.
- Several configurations for production modes are coming soon.

## API Docs
- Inside ```/assets``` directory, there are resources both for Swagger and for Insomnia.

## Tutorials, blogs, tips and tricks
- Work in progress, will be updated soon.

## Contributing
- I am looking forward to your help and support on maintaining and improving Stampede. 
- Contribution guide will be added shortly.

## License
- Stampede is an open-source framework licensed under the MIT License.

## Author
Anur Basic
