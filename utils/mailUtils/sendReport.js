// import nodemailer from 'nodemailer';
// import fs from 'fs';

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const html = fs.readFileSync('./playwright-report/index.html', 'utf8');

const reportDir = './playwright-report';
const zipPath = './playwright-report.zip';

// Step 1: Zip the report folder
function zipReportFolder(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✅ Zipped report (${archive.pointer()} total bytes)`);
      resolve();
    });

    archive.on('error', err => reject(err));

    archive.directory(sourceDir, false);
    archive.pipe(output);
    archive.finalize();
  });
}

async function sendReportEmail() {
  await zipReportFolder(reportDir, zipPath);
// SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.co.uk', 
  port: 587,              
  secure: false,          
  auth: {
    user: 'suresh.d@infoplusmdm.com',  
    pass: '!tpL@MDM$25'      
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// Email details
const mailOptions = {
  from: '"Playwright Reporter" <suresh.d@infoplusmdm.com>', 
  to: 'suresh.d@infoplusmdm.com,mohamedmeeran.s@infoplusmdm.com', 
  subject: 'Playwright Test Report',
  html: html,
  attachments: [
    {
      filename: 'index.html',
      path: './playwright-report/index.html'
    }
  ]
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error(`❌ Email failed: ${error}`);
  }
  console.log(`✅ Report sent: ${info.response}`);
  });
}

sendReportEmail();
