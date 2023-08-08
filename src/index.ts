import app from "./app"

const PORT : String | Number = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`)
})

