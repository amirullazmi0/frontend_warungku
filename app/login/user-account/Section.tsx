'use client';
import React, { useState } from 'react';
// import { Input } from '@mui/base/Input';
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { AlertSuccess } from '@/app/component/alert';
import Cookies from 'js-cookie';

const Section = () => {
  const [showPassword, setShowPassword] = useState<boolean | undefined>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean | undefined>(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);

  type Inputs = {
    email: string;
    password: string;
  };

  const API_URL = process.env.API_URL;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);

      if (response.data.success) {
        reset();
        Cookies.set('accessToken', response.data.data.accessToken);
        setLoginSuccess(true);
        setTimeout(() => {
          if (response.data.data.rolesName === 'super') {
            router.push(`/super`);
          } else {
            router.push(`/`);
          }
        }, 3000);
      } else {
        setLoginError(response.data.errors.message);
        setTimeout(() => {
          setLoginError(undefined);
        }, 3000);
      }
    } catch (error: any) {
      const errorResponse: AxiosError = error;

      if (errorResponse.message) {
        setLoginError(errorResponse.message);
        setTimeout(() => {
          setLoginError(undefined);
        }, 3000);
      }
    }
  };

  const router = useRouter();
  const navigation = (e: string) => {
    router.push(e);
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="card shadow-lg grid lg:md:grid-cols-2 overflow-hidden min-w-[50vw] bg-white">
        <div className="card-body">
          <div className="font-bold text-2xl e mb-4 txt-dark">Login</div>
          {loginError && (
            <div className="mb-4">
              <Alert severity="error" className="capitalize">
                {loginError}
              </Alert>
            </div>
          )}
          {loginSuccess && <AlertSuccess message="Login Berhasil" />}
          <form action="">
            <div className="flex flex-col gap-4">
              <FormControl className="w-full">
                <TextField
                  {...register('email', { required: 'Email harus di isi' })}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                />
                {errors.email && (
                  <div className="mt-2 text-end text-red-600 text-xs w-fit">
                    {errors.email.message}
                  </div>
                )}
              </FormControl>
              <FormControl className="w-full" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full"
                  {...register('password', {
                    required: 'Password harus di isi',
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {errors.password && (
                  <div className="mt-2 text-end text-red-600 text-xs w-fit">
                    {errors.password.message}
                  </div>
                )}
              </FormControl>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-[50%]"
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </div>
          </form>
          <hr className="mt-3 mb-3" />
          <div className="text-xs normal-case text-center txt-dark">
            Belum Punya Akun ?{' '}
            <span>
              <button
                className=" link-primary"
                onClick={() => navigation(`/register/user-account`)}
              >
                Daftar Sekarang
              </button>
            </span>
          </div>
        </div>
        <div className="bgr-primary"></div>
      </div>
    </div>
  );
};

export default Section;
