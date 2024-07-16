import { addressDTO } from "./address.model"

export class userDTO {
    id?: string
    fullName?: string
    email?: string
    rolesName?: string
    images?: string
    addressId?: string
    address?: addressDTO
    accessToken?: string
    lastActive?: Date
    updatedAt?: Date
    createdAt?: Date
}