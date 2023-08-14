const Order = require("../models/OrderModel");


//function to get all orders
exports.allOrders= async(req, res) => 
	 {
    console.log('this is recieve',req.params.org_name,req.params.org_address)
    try{
        Order.find({org_name:req.params.org_name,org_address:req.params.org_address}).then(orders=>{
            if(orders.length){
                
                    //io.emit('orderUpdate', { order: orders });
                return res.status(200).send({ order:orders });
                
            }
            else{
                return res.status(430).send({ null_data:"No orders found"});
            }
        })
    }

    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }



/////////////u have to correct it
//function to update an order
exports.updateOrder=[
	async (req, res) => {
    console.log('this is recieve',req.body);

    try{
        Order.updateOne(
            {org_name:req.body.org_name,org_address:req.body.org_address,date:req.body.date,buyer_name:req.body.buyer_name,},
            {
                items:req.body.items,
                amount:req.body.amount,
                status:req.body.status,
                discount:req.body.discount
            }
        ).then(()=>{
            console.log("Order updated successfully");
            return res.status(200).send({ message: "Order updated successfully" });
            }
        )
    }catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]