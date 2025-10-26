import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserManager } from '../utils/sessionManager';

const LoginForm = ({ onLogin, onSwitchToSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });

  const initialValues = {
    username: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setLoginError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = UserManager.authenticateUser(values.username, values.password);

      if (result.success) {
        const userSession = {
          username: values.username,
          loginTime: new Date().toISOString(),
          token: 'mock-jwt-token-' + Date.now()
        };

        localStorage.setItem('userSession', JSON.stringify(userSession));
        
        onLogin(userSession);
      } else {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Invoice Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the application
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Demo Credentials:</p>
                  <p>Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
                  <p>Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">password</span></p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToSignUp}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
