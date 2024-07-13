'use client'
import React, { useState } from 'react'
import { Input } from '@mui/base/Input';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

const Section = () => {
    const [showPassword, setShowPassword] = useState(false);
    type Inputs = {
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

    return (
        <div className='flex justify-center items-center min-h-screen p-4'>
            <div className="card shadow-lg grid lg:md:grid-cols-2 overflow-hidden min-w-[50vw] bg-white">
                <div className="card-body">
                    <div className="font-bold text-2xl e mb-4">
                        Login
                    </div>
                    <form action="">
                        <div className="flex flex-col gap-4">
                            <FormControl className='w-full'>
                                <TextField id="outlined-basic" label="Email" variant="outlined" />
                            </FormControl>
                            <FormControl className='w-full' variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
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
                            </FormControl>
                            <Button className='w-[50%]' type='submit' variant="contained">Login</Button>
                        </div>
                    </form>
                    <hr className='mt-3 mb-3' />
                    <div className="text-xs normal-case text-center">
                        Belum Punya Akun ? <span><button className=' link-primary' onClick={() => navigation(`/register/user-account`)}>Daftar Sekarang</button></span>
                    </div>
                </div>
                <div className="bgr-primary"></div>
            </div>
        </div>
    )
}

export default Section
