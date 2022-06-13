const { json } = require('express');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.use(express.static('public'))
MongoClient.connect("Your MongoDb connection string")
    .then(client => {
        console.log('Connected to Atlas Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        const PORT = process.env.PORT || 8080;


        app.get('/', async (req, res) => {
            // res.sendFile(__dirname + '/index.html')
            try {
                const cursor = await quotesCollection.find().toArray()
                res.render('index.ejs', { quotes: cursor })
            } catch (error) { console.error(error) }

        })
        /* Create a new quote */
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        /* Update quote of insert one*/
        app.put('/quotes', (req,res)=>{
            console.log(req.body)
            quotesCollection.findOneAndUpdate(
                {name:'Anestis'},
                    {$set:
                        {
                            name:req.body.name,
                            quote:req.body.quote
                        }
                    },
                    {
                        upsert:true
                    }
            ).then(result=>{
                console.log(result)
                res.json('Success')
            }).catch(error=>console.error(error))
        })

        /*Delete quote */
        app.delete('/quotes', (req,res)=>{
            quotesCollection.deleteOne(
                {name:req.body.name}
            ).then(result=>{
                if(result.deletedCount ===0){
                    return res.json('No quote to delete')
                }else return res.json('Darth Vadar quote Deleted successfully')
            }).catch(error=>console.error(error))
        })


        /*Server*/
        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`)
        })
    }).catch(err => console.log(err))

/*END POINT ASYNC/AWAIT TESTING FOR MONGODB */
    // app.get('/', async (req, res) => {

    //     const qdata = await quotesCollection.find().toArray()
    //     //res.sendFile(__dirname + '/index.html')
    //     console.log(qdata)
    //     res.json(qdata)
    // })
