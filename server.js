const express = require("express");
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');
const libre = require('libreoffice-convert');
const fs = require('fs');
const path = require('path');
const { createReport } = require('docx-templates');
const { convert } = require('html-to-text');

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
        var buf = Buffer.from(user_avatar, 'base64');
        fs.writeFileSync(`./tmp/${randomCharacters}.png`, buf);
        
        const template  = fs.readFileSync('./template1.docx');    

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
                work
            },
            additionalJsContext: {
                injectSvg: () => {
                    const svg_data = Buffer.from(`<svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                  <rect x="10" y="10" height="100" width="100" style="stroke:#ff0000; fill: #0000ff"/>
                                </svg>`, 'utf-8');               

                    // Providing a thumbnail is technically optional, as newer versions of Word will just ignore it.
                    const thumbnail = {
                        data: fs.readFileSync(`./tmp/${randomCharacters}.png`),
                        extension: '.png',
                    };
                    return { width: 2.5, height: 2.5, data: svg_data, extension: '.svg', thumbnail };                                                    
                }
            },
            processLineBreaks: true      
          });
          
        fs.writeFileSync(`./tmp/${randomCharacters}.docx`, buffer);

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


    fs.unlinkSync(`./tmp/${randomCharacters}.png`);

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