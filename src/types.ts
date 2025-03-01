export interface User {
    username: string
    password: string
    role: "mod" | "user"
}