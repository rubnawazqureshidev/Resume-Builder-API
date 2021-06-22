const express = require("express");
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');
const fs = require('fs');
const { createReport } = require('docx-templates');

app.use('/download', express.static(__dirname + "/tmp"));
app.use(cors());
app.use(express.json());

app.post('/:id', async (req, res) => {   
    const id = req.params.id;

    var { basics, work, education,  achievements, languages, skills, references, picture } = req.body;
    var { name, titreCv, profiles, email, phone, website, location } = basics;
    var { address } = location;

    try { 
        // generate doc
        var randomCharacters = nanoid(10);        
        var user_avatar = picture.replace(/^data:image\/\w+;base64,/, "");        
        const template  = fs.readFileSync(__dirname +`/template${id}.docx`);    

        const buffer = await createReport({
            template,
            data: {
                name, 
                titreCv,
                profiles: profiles,
                email,
                phone,
                website,
                address,
                skills,
                education,
                work,
                languages
            },
            additionalJsContext: {
                tile: () => { 
                    return { width: 2.5, height: 2.5, data: user_avatar, extension: '.png' };                                                    
                }
            },
            processLineBreaks: true      
          });
          
        fs.writeFileSync(__dirname +`/tmp/${randomCharacters}.docx`, buffer);      
    }
    catch(err) { 
        console.log(err);
    } 

    res.json({
        success: true,
        download: {
            doc: `http://173.230.130.56:3000/download/${randomCharacters}.docx`
        }
    });    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));