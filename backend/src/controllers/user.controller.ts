import { Request, Response } from 'express'
import userModel from '../models/user.model'
import bcrypt from 'bcrypt'
interface User{
  id: string,
  username: string,
  email: string,
  password: string,
  firstname: string,
  lastname:string
}

export const hashed = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12) 
}

export const compareHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll()
  res.json(users)
}

const getUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const user = userModel.findById(id)
  if (!user) {
    res.status(404).send('User not found')
    return
  }
  res.json(user)
}

const addUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { username, email, password, firstname, lastname } = req.body
  const hashedPassword = await hashed(password)
  const user = userModel.createUser({ username, email, password: hashedPassword,firstname, lastname })
  res.status(201).json(user)
}

const updateUserById = (req: Request<{ id: string }, {}, User>, res: Response) => {
  const { id } = req.params
  const { username, email, firstname, lastname } = req.body
  const user = userModel.editUser(id, { username, email, firstname, lastname  })
  if (!user) {
    res.status(404).json({ message: "User not found" })
    return
  }
  res.status(200).json(user)
}

const deleteUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const isDeleted = userModel.deleteUser(id)
  if (!isDeleted) {
    res.status(404).send('User not found')
    return
  }
  res.status(200).send('User deleted!')
}


const loginUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { username, password,} = req.body
  const user = userModel.findByUsername(username)
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  const isMatch = await compareHash(password, user.password )
  if (!isMatch) {
    res.status(401).json({ message: 'Password is invalid '})
    return
  }
  res.cookie('isAuthenticated', true, {
    httpOnly: true,
    maxAge: 3 * 60 * 1000,
    signed: true
  })
  res.cookie('userId', user.id, {
    httpOnly: true,
    maxAge: 3 * 60 * 1000,
    signed: true
  })
  res.status(200).json({ message: 'Login authenticated', status:200})
}

const userProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.signedCookies.userId
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await userModel.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const userInfo = {
      id: user.id,
      username: user.username,
    }

    res.status(200).json(userInfo)
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  deleteUserById,
  loginUser,
  userProfile
}