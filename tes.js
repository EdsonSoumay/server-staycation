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