import Router from '../lib/Router.ts';
import UserController from '../controllers/UserController.ts';
import AuthMiddleware from '../middleware/AuthMiddleware.ts';

Router.post('/users/register', UserController.registerUser);
Router.post('/users/login', UserController.loginUser);
Router.get('/users/iam', AuthMiddleware.authenticateUser, UserController.IAM);
Router.delete('/users/logout', AuthMiddleware.authenticateUser, UserController.logoutUser);
Router.patch('/users/:id/verify', AuthMiddleware.authenticateUser, UserController.verifyAccount);
Router.patch('/users/password/reset', UserController.resetUserPassword);
Router.patch('/users/account/recover/code', UserController.requireRecoveryCode);
Router.patch('/users/account/recover', UserController.recover);
