const express = require("express");
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');
const libre = require('libreoffice-convert');
const fs = require('fs');
const path = require('path');
const { createReport } = require('docx-templates');
const { convert } = require('html-to-text');
const os = require('os');

app.use('/download', express.static(__dirname + "/tmp"));
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {    
    var { basics, work, education,  achievements, languages, skills, references, picture } = req.body;
    var { name, titreCv, profiles, email, phone, website, location } = basics;
    var { address } = location;

    try { 
        // generate doc
        var randomCharacters = nanoid(10);        
        var user_avatar = picture.replace(/^data:image\/\w+;base64,/, "");        
        const template  = fs.readFileSync(__dirname +'/template2.docx');    

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

        // converting doc to pdf libreoffice for ubuntu

        // const extend = '.pdf'
        // const enterPath = `./tmp/${randomCharacters}.docx`;
        // const outputPath = `./tmp/${randomCharacters}${extend}`;
        
        // // Read file
        // const file = fs.readFileSync(enterPath);
        // // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
        // libre.convert(file, extend, undefined, (err, done) => {
        //     if (err) {
        //         console.log(`Error converting file: ${err}`);
        //     }            
        //     // Here in done you have pdf file which you can save or transfer in another stream
        //     fs.writeFileSync(outputPath, done);
        // });
    }
    catch(err) { 
        console.log(err);
    } 

    res.json({
        success: true,
        download: {
            doc: `http://173.230.130.56:3000/download/${randomCharacters}.docx`
            // pdf: `http://173.230.130.56:3000/download/${randomCharacters}.pdf`
        }
    });    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));