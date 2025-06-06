    import { getModelBySite } from '../modules/getModelBySite.js';
    import mongoose  from 'mongoose'

    
    const add = async (req, res) => {
            const siteName = req.body.site;  // get site name from request
            const ExpenseModel = getModelBySite(siteName);  // dynamically get model

            const newExpense = new ExpenseModel({
                date: req.body.Date,
                description: req.body.Description,
                amount: req.body.Amount,
                paymentMode: req.body.Payment,
                category: req.body.Category,
            });
                try {
                    await newExpense.save();
                    res.json({ success: true, message: "Expense added successfully" });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ success: false, message: "Error adding expense" });
                }
        };
    

        const getAllExpenses = async (req, res) => {
            const siteName = req.body.site;  // get site name from request
            const ExpenseModel = getModelBySite(siteName);  // dynamically get model

            try {
                const expenses = await ExpenseModel.find();  // get all documents
                res.json({ success: true, data: expenses });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Error fetching expenses" });
            }
        };


    const createCollection = async (req, res) => {
        const siteName = req.body.site; // e.g., "siteA"
        const ExpenseModel = getModelBySite(siteName);
        


        try {
            // Create collection
            await ExpenseModel.init();

            // Get all collection names from the DB
            const collections = await mongoose.connection.db.listCollections().toArray();
            const collectionNames = collections.map(col => col.name);

            res.json({
                success: true,
                message: `Collection for ${siteName} created.`,
                data: collectionNames, //Send to frontend
            });
        } catch (error) {
            console.error("Error creating collection:", error);
            res.status(500).json({
                success: false,
                message: "Collection creation failed.",
                collections: [],
            });
        }
    };

//     const getCollections = async (req, res) => {
        
//     try {
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         const collectionNames = collections.map(col => col.name);

//         res.json({
//             success: true,
//             data: collectionNames,
//         });
//     } catch (error) {
//         console.error("Error fetching collections:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch collections",
//         });
//     }
// };

const getCollections = async (req, res) => {
    try {
        if (!mongoose.connection || mongoose.connection.readyState !== 1) {
        return res.status(500).json({
            success: false,
            message: "DB not connected",
        });
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        const names = collections.map(col => col.name);

        res.json({ success: true, data: names });
    } catch (error) {
        console.error("❌ Error fetching collections:", error);
        res.status(500).json({
        success: false,
        message: "Failed to fetch collections",
        });
    }
};




const deleteCol= async (req, res) => {
    const siteName = req.params.site;
        try {
            await mongoose.connection.db.dropCollection(siteName);
            // Send back updated list
            const collections = await mongoose.connection.db.listCollections().toArray();
            const names = collections.map(col => col.name);
            res.json({ data: names });
        } catch (err) {
            res.status(500).json({ error: "Could not delete collection" });
        }
    };


    export { add,createCollection,getCollections,getAllExpenses,deleteCol };
