
    function createJob(jobTitle, city, employer, startDate, endDate, description) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: `\n${jobTitle}`,
                    bold: true
                }),
                new TextRun({
                    text: `\n${city}`,
                    bold: true
                }),
                new TextRun({
                    text: `\n${employer}`,
                    bold: true
                }),                
                new TextRun({
                    text: `\n${startDate}`,
                    bold: true
                }),     
                new TextRun({
                    text: `\n${endDate}`,
                    bold: true
                }),
                new TextRun({
                    text: `\n${description}`,
                    bold: true
                }),             
            ]
        });
    }