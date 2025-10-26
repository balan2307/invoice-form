import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserManager } from '../utils/sessionManager';

const SignUpForm = ({ onSignUp, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, 'First name must be at least 2 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .required('Last name is required'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setSignUpError('');
    setSignUpSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = UserManager.registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
        role: 'user'
      });

      if (result.success) {
        setSignUpSuccess(true);
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      } else {
        setSignUpError(result.error);
      }
    } catch (error) {
      setSignUpError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Registration Successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your account has been created successfully. Redirecting to login...
            </p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Invoice Manager to get started
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="First name"
                    />
                    <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Last name"
                    />
                    <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Choose a username"
                  />
                  <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
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
                    placeholder="Create a password"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div className="flex items-center">
                  <Field
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-500">
                      Terms and Conditions
                    </button>
                  </label>
                </div>
                <ErrorMessage name="agreeToTerms" component="div" className="text-sm text-red-600" />
              </div>

              {signUpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {signUpError}
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
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpForm;
