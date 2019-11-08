const program = require('commander');

program.version('0.0.1');

program
  .option('-c, --consumer', 'Up as consumer')
  .option('-p, --producer', 'Up as producer')

  program.parse(process.argv);


function setModality(){
    if(program.consumer){
        process.env.MODALITY = "consumer";
        console.log('consumer');
        return
    }

    if(program.producer){
        console.log('producer');
        process.env.MODALITY = "producer";
        return
    }
    
}
module.exports = setModality()