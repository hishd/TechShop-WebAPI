import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin-User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Hishara',
    email: 'hishara@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Nimesh',
    email: 'nimesh@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
]

export default users
