'use client'
import { userDTO } from '@/model/user.model'
import { Alert, Button, Skeleton, TextField } from '@mui/material'
import axios from 'axios'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { addressDTO } from '@/model/address.model'
const FormUpdateAddress = () => {
    const [address, setAddress] = useState<addressDTO | undefined>(undefined)
    const [updateAddressSuccess, setUpdateAddressSuccess] = useState<boolean | undefined>(undefined)

    const API_URL = process.env.API_URL
    const accessToken = Cookies.get('accessToken')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prevAddress => ({
            ...prevAddress,
            [name]: value
        }));
    };

    const handleUpdateAddress = async () => {
        if (address) {
            try {
                const formData = new FormData()
                formData.append('active', `${address?.active}`)
                formData.append('jalan', `${address?.jalan}`)
                formData.append('rt', `${address?.rt}`)
                formData.append('rw', `${address?.rw}`)
                formData.append('kodepos', `${address?.kodepos}`)
                formData.append('kelurahan', `${address?.kelurahan}`)
                formData.append('kecamatan', `${address?.kecamatan}`)
                formData.append('kota', `${address?.kota}`)
                formData.append('provinsi', `${address?.provinsi}`)

                const response = await axios.put(`${API_URL}/api/user/user/update/profile/address`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                if (response.data.success) {
                    setUpdateAddressSuccess(true)
                    setTimeout(() => {
                        setUpdateAddressSuccess(undefined)
                    }, 5000)
                }
            } catch (error) {

            }
        }
    }

    const getAddress = async () => {
        try {
            try {
                const response = await axios.get(`${API_URL}/api/user/user/profile/address`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                if (response.data.success) {
                    setAddress(response.data.data)
                }

            } catch (error) {

            }
        } catch (error) {

        }
    }

    useEffect(() => {
        // getProfile()
        getAddress()
    }, [])

    return (
        <div className="flex flex-col gap-4 mt-5">
            {updateAddressSuccess &&
                <div className='mt-3 fixed top-32 right-3 z-50'>
                    <Alert className='shadow-lg' severity="success">Alamat berhasil diperbarui</Alert>
                </div>
            }
            <div className="text-lg font-extrabold">ALAMAT KAMU</div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">Jalan</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="jalan" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.jalan} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">RT</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="rt" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.rt} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">RW</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="rw" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.rw} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">Kodepos</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="kodepos" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.kodepos} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">Kelurahan</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="kelurahan" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.kelurahan} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">Kecamatan</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="kecamatan" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.kecamatan} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">Kota / Kabupaten</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="kota" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.kota} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <div className="grid lg:md:grid-cols-10 items-start">
                <div className="lg:md:col-span-2">Provinsi</div>
                <div className="lg:md:block hidden col-span-1">:</div>
                <div className="lg:md:col-span-7">
                    {address ?
                        <TextField name="provinsi" onChange={handleChange} id="outlined-basic" className='w-full' value={address?.provinsi} variant="outlined" />
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    }
                </div>
            </div>
            <Button onClick={handleUpdateAddress} variant="contained" disableElevation>
                SIMPAN ALAMAT
            </Button>
        </div>
    )
}

export default FormUpdateAddress
