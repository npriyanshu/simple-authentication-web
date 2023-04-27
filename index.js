const { urlencoded } = require('express');
const express = require('express');
const path = require('path');
const users = require('./dbcon')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express();
publicpath = path.join(__dirname, "public");

// but if type:module in package.json then 
// publicpath = path.join(path.resolve(),"public");


            // middlewares
app.use(express.static(publicpath));
app.use(cookieParser())
                // we can also make a custom middleware for authentication 
const isAuthenticate = async (req, res, next) => {
                // const token = req.cookies.token   //<--- to take the values from cookies
    const { token } = req.cookies
    if (token) {
            // when we get token we have to decode it 
        const decoded = jwt.verify(token,"secretkey")

        // saving data in req.user to access it all over the code 
        req.user = await users.findById(decoded._id)
        next();
    } else {
        res.render("login");
    }
};

// to use the data send by form we will use this middle ware 
app.use(urlencoded({ exptended: true })); // <-- using this for req.body data 

app.set('view engine', 'ejs');

// app.get('/',(req,res)=>{
    //     // console.log(req.body)
    //     res.render("index")
    // })
    
    app.get('/', isAuthenticate, (req, res) => {
        console.log("-->>>>---->",req.user)
        res.render('logout',{name : req.user.name});
})
app.post('/login', async (req, res) => {


    const { name, email } = req.body
    let user =  await users.create({ name, email });

    const token = jwt.sign({ _id: user._id },"secretkey") // <-- encoded token from user.id

    const expiresInMs = 60 * 1000; // 1 minute
    const expirationDate = new Date(Date.now() + expiresInMs);
    res.cookie("token",token, {
        httpOnly: true,
        expires: expirationDate,
    });
    console.log(req.body)
    res.redirect("/")


})

app.get('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.redirect('/');
});


app.get('/success', (req, res) => {

    res.render("success")
})


app.post('/submit', async (req, res) => {
    /* method 1 */
    const { name, email, date, rollno } = req.body
    let data = new users({ name, email, date, rollno });
    let result = await data.save();

    /* method 2 */
    // let data = new users(req.body);
    // let result = await data.save();
    // console.log(result)
    // console.log(req.body)

    // res.render("success")
    //or 
    res.redirect('/success')

})
app.listen(5500);