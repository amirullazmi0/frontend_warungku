'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@mui/base/Input';
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { error } from 'console';
import Error from 'next/error';
import { AlertSuccess } from '@/app/component/alert';

const Section = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<boolean | undefined>(undefined)
    const [errorSubmit, setErrorSubmit] = useState<string | undefined>(undefined)
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

    type Inputs = {
        fullName: string
        email: string
        password: string
    }

    const { register, handleSubmit, watch, reset, setValue, formState: { errors }, } = useForm<Inputs>()

    const router = useRouter()

    const navigation = (e: string) => {
        router.push(e)
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const API_URL = process.env.API_URL

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, data)

            console.log(response.data);
            if (response.data.success) {
                reset()
                setSubmitSuccess(true)
                setTimeout(() => {
                    router.push(`/login/user-account`)
                }, 3000)
            } else {
                setErrorSubmit(response.data.errors.message)
                setTimeout(() => {
                    setErrorSubmit(undefined)
                }, 3000)
            }

        } catch (error: any) {
            const errorResponse: AxiosError = error

            if (errorResponse.message) {
                setErrorSubmit(errorResponse.message)
                setTimeout(() => {
                    setErrorSubmit(undefined)
                }, 3000)
            }
        }
    }

    const onChangeConfirmPassword = (e: string) => {
        const stringPassword = e
        setConfirmPassword(stringPassword)
        setErrorPassword(false)

        if (stringPassword === password) {
            setValue('password', stringPassword)
            setErrorPassword(false)
        } else if (stringPassword && stringPassword.length > 0 && stringPassword !== password) {
            setErrorPassword(true)
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div className='flex justify-center items-center min-h-screen p-4 bgr-primary'>
            <div className="card border shadow overflow-hidden min-w-[50vw] bg-white">
                <div className="card-body">
                    <div className="font-bold text-2xl e mb-4">
                        SIGN UP
                    </div>
                    {errorSubmit &&
                        <div className="mb-4">
                            <Alert severity="error" className='capitalize'>{errorSubmit}</Alert>
                        </div>
                    }
                    {submitSuccess &&
                        <AlertSuccess message='Anda Berhasil Melakukan Registrasi' />
                    }
                    <form action="">
                        <div className="grid lg:md:grid-cols-2 gap-4">
                            <FormControl className='w-full'>
                                <TextField {...register('fullName', { required: '* Nama lengkap harus di isi' })} id="outlined-basic" label="Nama Lengkap" variant="outlined" />
                                {errors.fullName &&
                                    <div className="mt-2 text-end text-red-600 text-xs w-fit">
                                        {errors.fullName.message}
                                    </div>
                                }
                            </FormControl>
                            <FormControl className='w-full'>
                                <TextField {...register('email', { required: '* Email harus di isi' })} id="outlined-basic" label="Email" variant="outlined" />
                                {errors.email &&
                                    <div className="mt-2 text-end text-red-600 text-xs w-fit">
                                        {errors.email.message}
                                    </div>
                                }
                            </FormControl>
                            <FormControl className='w-full' variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full'
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
                                {!password &&
                                    <div className="mt-2 text-end text-red-600 text-xs w-fit">
                                        * Password harus di isi
                                    </div>
                                }
                            </FormControl>
                            <FormControl className='w-full' variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-confirm-password">Konfirmasi Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className='w-full'
                                    onChange={(e) => onChangeConfirmPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Konfirmasi Password"
                                />
                                {errorPassword === true &&
                                    <div className="mt-2 text-end text-red-600 text-xs w-fit">
                                        Konfirmasi Password harus sama
                                    </div>
                                }
                            </FormControl>
                            <div className="flex justify-center lg:md:col-span-2">
                                <Button onClick={handleSubmit(onSubmit)} className='w-[40%]' type='submit' variant="contained">Sign Up</Button>
                            </div>
                        </div>
                    </form>
                    <hr className='mt-3 mb-3' />
                    <div className="text-xs normal-case text-center">
                        Sudah Punya Akun ? <span><button className=' link-primary' onClick={() => navigation(`/login/user-account`)}>Sign In</button></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Section
