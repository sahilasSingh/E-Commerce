const express = require('express');
const app = express();
const dotenv = require('dotenv').config({ path: `./env/dev.env`});
const mongoose = require('mongoose');
require("./config/database");
const PORT = process.env.PORT;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const prodCategoryRouter = require('./routes/prodCategoryRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const colorRouter = require('./routes/colorRoute');
const enqRouter = require('./routes/enqRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/prodcategory",prodCategoryRouter);
app.use("/api/blogcategory",blogCategoryRouter);
app.use("/api/brand",brandRouter);
app.use("/api/coupon",couponRouter);
app.use("/api/color",colorRouter);
app.use("/api/enquiry",enqRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() =>{
 console.log(`Server is running at port ${PORT}`);
});