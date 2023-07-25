const Note=require('../models/NoteModel');

function NoteData(data){
    this.org_name=data.org_name;
    this.org_address=data.org_address;
    this.title=data.title;
    this.content=data.content;

}
//To create or update the notes
function createNote(org_name,org_address,title,content){
    return (new Note(
        {   
            org_name:org_name,
            org_address:org_address,
            title:title,
            content:content

        })
    )
}

//function to add new notes
exports.addNotes = [
	
	 (req, res) => {
    console.log('this is recieve',req.body)
    try{
        Note.findOne({org_name:req.body.org_name,org_address:req.body.org_address,title:req.body.title}).then((note) => {
        if(note){
            console.log("A note already exist with this title");
            return res.status(430).send({ error: "A note already exist with this title. Please rename this note." });
        }else{
            let note=createNote(req.body.org_name,req.body.org_address,req.body.title,req.body.content);
            note.save();
            console.log("Note created successfully")
            return res.status(200).send({ message: "Note created successfully" });
        }
    })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to update existing notes

exports.updateNotes = [
	
	async (req, res) => {
    console.log('this is recieve',req.body);

    try{
        Note.updateOne(
            {org_name:req.body.org_name,org_address:req.body.org_address,title:req.body.old_title},
            {title:req.body.title,content:req.body.content}
        ).then(()=>{
            console.log("Note updated successfully");
            return res.status(200).send({ message: "Note updated successfully" });
            }
        )
    }catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to delete selected notes
exports.deleteSelectedNotes = [
	
	async (req, res) => {
    console.log('this is recieve',req.params)

    try{
        var DeletedNotes=req.params.title.split(',');
        console.log(DeletedNotes)
        for (var d=0;d<DeletedNotes.length;d++){
            Note.deleteOne({org_name:req.params.org_name,org_address:req.params.org_address,title:DeletedNotes[d]})
                console.log(DeletedNotes[d],"Note deleted successfully");
        }
        return res.status(200).send({ message: "Notes deleted successfully" });
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to display all Notes name
exports.allNotes = [
	
	async (req, res) => {
    console.log('this is recieve',req.params.org_name,req.params.org_address)
    try{
        Note.find({org_name:req.params.org_name,org_address:req.params.org_address}).then(note=>{
            if(note.length){
                let notes_name=[]
                for (var n=0;n<note.length;n++){
                    var N=new NoteData(note[n])
                    notes_name.push(N.title)
                }
                return res.status(200).send({ notes:notes_name });
            }
            else{
                return res.status(430).send({ null_data:"No notes found"});
            }
        })
    }

    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to display the selected Note
exports.openNote = [
	
	async (req, res) => {
    console.log('this is recieve',req.params);
    try{
        Note.findOne({org_name:req.params.org_name,org_address:req.params.org_address,title:req.params.title}).then(note=>{
            console.log(note)
            if(note){
                
                
                let n=new NoteData(note)
                
                return res.status(200).send({ notes:n });
            }
            else{
                return res.status(430).send({ null_data:"No such note found"});
            }
         
        })
    }
    catch(err){
        console.log(err);
        return res.status(420).send({ error: err});
    }
    }
]

