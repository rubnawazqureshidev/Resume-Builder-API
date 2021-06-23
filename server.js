const express = require("express");
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');
const fs = require('fs');
const libre = require('libreoffice-convert');
const { createReport } = require('docx-templates');

app.use('/download', express.static(__dirname + "/tmp"));
app.use(cors());
app.use(express.json());

app.post('/:id', async (req, res) => {   
    const id = req.params.id;

    var { basics, work, education,  achievements, languages, skills, references, picture } = req.body;
    var { name, titreCv, profiles, email, phone, website, location } = basics;
    var { address } = location;

    var profile_html = '';
	for(var i=0; i<profiles.length; i++){
	  	profile_html += profiles[i].description;
	}

	var work_html = '';
		for(var i=0; i<work.length; i++){  	
		work_html += "<p>"+work[i].jobTitle+"</p>";
		work_html += "<p>"+work[i].startDate + " - " + work[i].endDate + "</p>";
		work_html += work[i].description;
	}

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
                profiles: profile_html,
                email,
                phone,
                website,
                address,
                skills,
                education,
                work: work_html,
                languages,
                references
            },
            additionalJsContext: {
                tile: () => { 
                    return { width: 2.5, height: 2.5, data: user_avatar, extension: '.png' };                                                    
                }
            },
            processLineBreaks: true      
        });
          
        fs.writeFileSync(__dirname +`/tmp/${randomCharacters}.docx`, buffer);   

        /* 
            // converting doc to pdf libreoffice for ubuntu
            const enterPath = __dirname+`/tmp/${randomCharacters}.docx`;
            const outputPath = __dirname+`./tmp/${randomCharacters}${extend}`;
                    
            // Read file
            const file = fs.readFileSync(enterPath); 
            // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
            libre.convert(file, ".pdf", undefined, (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                }            
                // Here in done you have pdf file which you can save or transfer in another stream
                fs.writeFileSync(outputPath, done);
            });
        */        
    }
    catch(err) { 
        console.log(err);
    } 

    res.json({
        success: true,
        download: {
            doc: `http://173.230.130.56:3000/download/${randomCharacters}.docx`,
            // pdf: `http://173.230.130.56:3000/download/${randomCharacters}.pdf`
        }
    });    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));