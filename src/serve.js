
import express from 'express'
import axios from 'axios'
const app = express()
const port = 8090

app.get('/voice/oauth', async (req, res) => {
  try {
    const result = await axios.post('https://aip.baidubce.com/oauth/2.0/token?client_id=IyCRBhk5HHDyiyB4hykIjUSH&client_secret=WEchmCgbezosAZBiTVjhNaRIHFaE1EER&grant_type=client_credentials', {}, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const obj = {
      code: 200,
      data: result.data
    }
    res.send(JSON.stringify(obj))
  } catch (error) {
    
    const obj = {
      code: 500,
      data: error
    }
    res.send(JSON.stringify(obj))
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})