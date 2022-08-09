const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Users = require('../models/Users');
// const Test = require('../models/Tes')
const fs = require('fs-extra')
const path = require('path');
const bcrypt = require('bcryptjs')

module.exports = {
    viewSignin: async (req, res) =>{
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}

            //ini kondisi agar admin sudah tidak bisa mengakses login ketika sudah login
            if (req.session.user == null || req.session.user == undefined) {
                //jika nd ada user, halaman yang ditampilkan adalah login
                res.render('index' ,{alert, title: 'Staycation | Login'}); //{} = cara mendustructurisasi category
              } else {
                //tapi kalo ada user.sesion, halaman dashboard yang ditampilkan
               res.redirect('/admin/dashboard')
              }
        } catch (error) {
            res.redirect('/admin/signin')
        }
    },
    actionSignin: async (req, res) => {
        try {
          const { username, password } = req.body;
          const user = await Users.findOne({ username: username });
          if (!user) {
            req.flash('alertMessage', 'User yang anda masukan tidak ada!!');
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/signin');
          }
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            req.flash('alertMessage', 'Password yang anda masukan tidak cocok!!');
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/signin');
          }
    
         // untuk sesion user
          req.session.user = {
            id: user.id,
            username: user.username
          }
    
          res.redirect('/admin/dashboard');
    
        } catch (error) {
          res.redirect('/admin/signin');
        }
      }, 
      actionLogout: (req, res)=>{
        req.session.destroy(); // hapus sesision
        res.redirect('/admin/signin'); // redirect ke sign in
      },
    viewDashboard: async (req, res) =>{
        try {
            const member = await Member.find();
            const booking = await Booking.find();
            const item = await Item.find();
            res.render('admin/dashboard/view_dashboard',{
                title : 'Staycation | Dashboard',
                user: req.session.user,
                member,
                booking,
                item
            });
        } catch (error) {
            res.redirect('/admin/dashboard')
        }
        
    },
    viewCategory: async (req, res) =>{
        try {
            const category = await Category.find() // find() = ambil semua data didalam colection category
            // console.log(category)
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}
            res.render('admin/category/view_category' ,{
                category, 
                alert, 
                title: 'Staycation | Category',
                user: req.session.user
            }); //{} = cara mendustructurisasi category
        } catch (error) {
            res.render('admin/category'); 
        }
    },
    addCategory: async (req, res) =>{
        try {
            const {name} = req.body;
            // console.log(name)
            await Category.create({name});
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
   
    editCategory: async (req, res) =>{
        try {
            const {id, name} = req.body;
            const category =  await Category.findOne({_id:id});
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            // console.log("Category:",category)
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
      
    },
    deleteCategory: async(req, res) =>{
        try {
            const {id} = req.params;
            const category = await Category.findOne({_id:id})
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    viewBank: async (req, res) =>{
        try {
            const bank = await Bank.find()
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}
            res.render('admin/bank/view_bank',{
                title : 'Staycation | Bank',
                alert,
                bank,
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    addBank: async (req,res)=>{
        try {
            const {name, nameBank, nomorRekening} = req.body;
            // console.log("Req file update:", req.file)
            // console.log("data lainnya:", name, nameBank, nomorRekening)
            await Bank.create({
                name, 
                nameBank, 
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            
            // await Test.create({name});

            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    editBank:async (req, res) =>{
        try {
            const {id, name, nameBank, nomorRekening} = req.body;
            // console.log("name:",name) // edson ingat ini
            const bank = await Bank.findOne({_id: id});
            //jika tidak update gambar
            if(req.file == undefined){
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }else{
                //jika update gambar
                await fs.unlink(path.join(`public/${bank.imageUrl}`)) // untuk menghapus gambar yang lama
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    deleteBank: async (req, res)=>{
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({_id: id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`)) // untuk menghapus gambar
            await bank.remove();
            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    viewItem:  async (req, res) =>{
        try {
            // const item = await Item.find()
            const item = await Item.find()
                .populate({path:'imageId', select: 'id imageUrl'})
                .populate({path:'categoryId', select: 'id name'}) // populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung
            // console.log("item dengan populate:",item)
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}
            res.render('admin/item/view_item',{
                title : 'Staycation | Item',
                category,
                alert,
                item,
                action: 'view',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    addItem: async(req, res)=>{
        try {
            const {categoryId, title, price, city, about} = req.body;
            // console.log("req files:",req.files)
            if(req.files.length > 0){
                //sepertinya untuk mengecek image yang masuk
                const category = await Category.findOne({_id: categoryId});
                const newItem = {
                    categoryId: category._id,
                    title,
                    description :about,
                    price,
                    city
                }
                //mengambil data item
                const item = await Item.create(newItem)
                // console.log("isi dari item:",item)
                //push id item ke category
                category.itemId.push({_id: item._id})// cara ba push kedalam properti dalam model
                // habis itu disimpan
                await category.save();
                
                // perulangan ini dilakukan jika image yang diinput lebih dari satu
                for(let i = 0; i <req.files.length; i++){
                    const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}`})
                    item.imageId.push({_id: imageSave._id});
                    await item.save();
                }
                req.flash('alertMessage', 'Success Add Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showImageItem: async (req, res)=>{
    try {
        const {id} = req.params;
          const item = await Item.findOne({_id: id})
          .populate({path:'imageId', select: 'id imageUrl'}) // populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung. select : untuk memilih data secara spesific untuk ditampilkan
    //   console.log("item image url dengan image url:",item.imageId)
        // const category = await Category.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus}
        res.render('admin/item/view_item',{
            title : 'Staycation | Image Item',
            alert,
            item,
            action:'show image',
            user: req.session.user
        });

    } catch (error) {
        req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
     }
    },

    showEditItem: async (req, res)=>{
        try {
            const {id} = req.params;
              const item = await Item.findOne({_id: id})
              .populate({path:'imageId', select: 'id imageUrl'}) // populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung. select : untuk memilih data secara spesific untuk ditampilkan
              .populate({path:'categoryId', select: 'id name'}) // populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung. select : untuk memilih data secara spesific untuk ditampilkan
        //   console.log("item image url dengan image url:",item.imageId)
        // console.log("item:",item)
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}
            res.render('admin/item/view_item',{
                title : 'Staycation | Edit Item',
                alert,
                item,
                category,
                action:'edit',
                user: req.session.user
            });
    
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
        },
    editItem: async(req, res)=>{
        try {
            const {id} = req.params;
            const {categoryId, title, price, city, about} = req.body;
            const item = await Item.findOne({_id: id})
            .populate({path:'imageId', select: 'id imageUrl'}) // populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung. select : untuk memilih data secara spesific untuk ditampilkan
            .populate({path:'categoryId', select: 'id name'}) // populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung. select : untuk memilih data secara spesific untuk ditampilkan
            
            if(req.files.length > 0){
                //edit dengan  gambar
                //check gambar lama berdasarkan id

                // update gambar jika jumlah gambar yang ada sama dengan gambar update
                // for(let i = 0; i < item.imageId.length; i++){
                //     const imageUpdate = await Image.findOne({_id: item.imageId[i]._id})
                //     //delete gambar yg lama
                //     await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`)) // untuk menghapus gambar yang lama
                //     //update gambar
                //         imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                //         await imageUpdate.save();
                // }
                

                /* Code versi edson */
                ///code untuk jumlah gambar yang diupdate dan gambar yg lama tidak sama
                //bikin array
                let newArray = []
                //hapus gambar lama
                for(let i = 0; i < item.imageId.length; i++){
                    const image = await Image.findOne({_id: item.imageId[i]._id})
                    // console.log("id image di looping:", image._id)
                    //push image._id ke newArray supaya tidak bermasalah di looping
                    newArray.push(image._id)
                    ///hapus gambar yg lama di folder images
                    await fs.unlink(path.join(`public/${image.imageUrl}`)) // untuk menghapus gambar yang lama
                    //hapus image di schema image
                    await image.remove();
                }
                newArray.map( (data, i)=>{
                    console.log("new array:",data);
                    item.imageId.pull({_id: data});
                })
                //save item yang telah dihapus imageId gambarnya
                await item.save();
                
                // timpa dengan gambar yang baru
                for(let i = 0; i <req.files.length; i++){
                    const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}`})
                    item.imageId.push({_id: imageSave._id});
                    await item.save();
                }
                /* Code versi edson */

                

                //save data yg cma tulisan
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = about;
                item.categoryId = categoryId;
                // save data item
                await item.save();
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');

            }else{ // edit tanpa gambar
                //mengubah data item menjadi data yg baru di update
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = about;
                item.categoryId = categoryId;
                // save data item
                await item.save();
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    deleteItem: async (req, res) =>{
        // console.log("delete item")
        try {
            //check id dari params
            const {id} = req.params;
            // di check idnya ada atau tidak di dalam Item
            const item = await Item.findOne({_id: id}).populate('imageId featureId activityId'); //short hand dari populate.  populate: untuk mengambil spesific data (bisa semua data) yg berada pada schema yg terhubung. disini schema Item.name yang diambil karena terhubung. select : untuk memilih data secara spesific untuk ditampilkan
            // console.log("isi dari delete item:",item);
            
            //looping untuk menenukan featureId untuk mendelete featured
            for (let  i = 0; i < item.featureId.length; i++){
                Feature.findOne({_id:item.featureId[i]._id}).then((feature)=>{
                   // setelah dapat idnya, kita hapus gambar di foldernya dengan menggunakan unlink                    
                   // kalo didalam .then harus deklarasi async, jadi await dibawah kita hapus
                    fs.unlink(path.join(`public/${feature.imageUrl}`)) // untuk menghapus gambar yang lama
                    //habis itu hapus feature yang ada di collection
                   feature.remove(); // remove data dari collection (mungkin image)
                }).catch((error)=>{
                    req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/item');
                })
             }

             //looping untuk menenukan activityId untuk mendelete activity
            for (let  i = 0; i < item.activityId.length; i++){
                Activity.findOne({_id:item.activityId[i]._id}).then((activity)=>{
                   // setelah dapat idnya, kita hapus gambar di foldernya dengan menggunakan unlink                    
                   // kalo didalam .then harus deklarasi async, jadi await dibawah kita hapus
                    fs.unlink(path.join(`public/${activity.imageUrl}`)) // untuk menghapus gambar yang lama
                    //habis itu hapus feature yang ada di collection
                   activity.remove(); // remove data dari collection (mungkin image)
                }).catch((error)=>{
                    req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/item');
                })
             }

            //looping untuk menenukan imageId
            for (let  i = 0; i < item.imageId.length; i++){
                Image.findOne({_id:item.imageId[i]._id}).then((image)=>{
                   // setelah dapat idnya, kita hapus gambar di foldernya dengan menggunakan unlink                    
                   // kalo didalam .then harus deklarasi async, jadi await dibawah kita hapus
                    fs.unlink(path.join(`public/${image.imageUrl}`)) // untuk menghapus gambar yang lama
                    //habis itu hapus image yang ada di collection
                   image.remove(); // remove data dari collection (mungkin image)
                }).catch((error)=>{
                    req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/item');
                })
             }


            //setelah looping selesai kita remove itemnya
            await item.remove();
            req.flash('alertMessage', 'Success Delete Item');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item'); 
        }
    },
    viewDetailItem: async (req, res)=>{
        const {itemId} = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}
        
            const feature = await Feature.find({itemId: itemId}) // ambil data didalam fiture berdasarkan itemId
            const activity = await Activity.find({itemId: itemId}) // ambil data didalam activity berdasarkan itemId
            // console.log(feature)
            res.render('admin/item/detail_item/view_detail_item',{
                title:'Staycation | Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`); 
        }
    },
    addFeature: async (req,res)=>{
        const {name, qty, itemId} = req.body;
        try {
            // console.log("Req file update:", req.file)
            if(!req.file){
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`); 
            }
            //ambil setiap data yan diupload ke feature
           const feature = await Feature.create({
                name, 
                qty,
                itemId, 
                imageUrl: `images/${req.file.filename}`
            });

            // ambil schema item
            const item = await Item.findOne({_id:itemId});
            //push id feature ke dalam item
            item.featureId.push({_id:  feature._id});
            //save item
            await item.save()
            
            req.flash('alertMessage', 'Success Add Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    editFeature:async (req, res) =>{
        const {id, name, qty, itemId} = req.body;
        try {
            // console.log("name:",name) // edson ingat ini
            const feature = await Feature.findOne({_id: id});
            //jika tidak update gambar
            if(req.file == undefined){
                feature.name = name;
                feature.qty = qty;
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }else{
                //jika update gambar
                await fs.unlink(path.join(`public/${feature.imageUrl}`)) // untuk menghapus gambar yang lama
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteFeature: async (req, res)=>{
        const { id, itemId } = req.params;
        console.log("delete feature is ready. id:", id, "item id:", itemId)
        // console.log("id di delete feature:",id)
        try {
            // cari id dari fitur yang sama dengan id yang dikirim
            const feature = await Feature.findOne({_id: id});
            
            //cari itemId dari featureId
            const item = await Item.findOne({_id: itemId}).populate('featureId')
            for(let i = 0; i < item.featureId.length; i++){
                //jika item.featureId[id]._id == feature._id, pull featured id tersebut
                if(item.featureId[i]._id.toString() === feature._id.toString()){
                   //gak perlu pake [i], karna kita sudah cek di kondisi if di atas
                    item.featureId.pull({_id: feature._id});
                    await item.save();
                }
            }
            //remove dari image url
            await fs.unlink(path.join(`public/${feature.imageUrl}`)) // untuk menghapus gambar
            
            //remove di colection featurenya
            await feature.remove();
            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    addActivity: async (req,res)=>{
        const {name, type, itemId} = req.body;
        try {
            // console.log("Req file update:", req.file)
            if(!req.file){
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`); 
            }
            //ambil setiap data yan diupload ke feature
           const activity = await Activity.create({
                name, 
                type,
                itemId, 
                imageUrl: `images/${req.file.filename}`
            });

            // ambil schema item
            const item = await Item.findOne({_id:itemId});
            //push id feature ke dalam item
            item.activityId.push({_id:  activity._id});
            //save item
            await item.save()
            
            req.flash('alertMessage', 'Success Add Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    editActivity:async (req, res) =>{
        const {id, name, type, itemId} = req.body;
        try {
            // console.log("name:",name) // edson ingat ini
            const activity = await Activity.findOne({_id: id});
            //jika tidak update gambar
            if(req.file == undefined){
                activity.name = name;
                activity.type = type;
                await activity.save();
                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }else{
                //jika update gambar
                await fs.unlink(path.join(`public/${activity.imageUrl}`)) // untuk menghapus gambar yang lama
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`
                await activity.save();
                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteActivity: async (req, res)=>{
        const { id, itemId } = req.params;
        // console.log("delete activity is ready. id:", id, "item id:", itemId)
        // console.log("id di delete activity:",id)
        try {
            // cari id dari fitur yang sama dengan id yang dikirim
            const activity = await Activity.findOne({_id: id});
            
            //cari itemId dari activityId
            const item = await Item.findOne({_id: itemId}).populate('activityId')
            for(let i = 0; i < item.activityId.length; i++){
                //jika item.activityId[id]._id == activity._id, pull activity id tersebut
                if(item.activityId[i]._id.toString() === activity._id.toString()){
                   //gak perlu pake [i], karna kita sudah cek di kondisi if di atas
                    item.activityId.pull({_id: activity._id});
                    await item.save();
                }
            }
            //remove dari image url
            await fs.unlink(path.join(`public/${activity.imageUrl}`)) // untuk menghapus gambar
            
            //remove di colection activitynya
            await activity.remove();
            req.flash('alertMessage', 'Success Delete Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`); // `$error.message` = `${error.message}`  (sama sja kek bgini)
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },

    viewBooking: async (req, res) =>{
        try {
            const booking = await Booking.find()
             .populate('memberId')
             .populate('bankId')

            //  console.log("booking:",booking)
            res.render('admin/booking/view_booking',{ //res render untuk mengirimikan data kedalam view
                title : 'Staycation | Booking',
                user: req.session.user,
                booking
            });
        } catch (error) {
            res.redirect('/admin/booking')
        }
    },
    showDetailBooking: async (req, res)=>{
        const { id } = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus}

            const booking = await Booking.findOne({_id : id}) // perbedaan find dan findOne terhadap kembalian data. find : mengembalikan array of  object, kalo findOne mengembalikan object
            .populate('memberId')
            .populate('bankId')
            //  console.log(booking)
            res.render('admin/booking/show_detail_booking',{ //res render untuk mengirimikan data kedalam view
                title : 'Staycation | Detail Booking',
                user: req.session.user,
                booking,
                alert
            });

        } catch (error) {
            res.redirect('/admin/booking')
        }
    },
    actionConfirmation: async (req, res) =>{
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({_id: id});
            booking.payments.status = 'Accept';
            req.flash('alertMessage', 'Success Confirmation Pembayaran');
            req.flash('alertStatus', 'success');
            await booking.save()
            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    }, 

    actionReject: async (req, res) =>{
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({_id: id});
            booking.payments.status = 'Reject';
            req.flash('alertMessage', 'Success Reject Pembayaran');
            req.flash('alertStatus', 'success');
            await booking.save()
            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    }

}