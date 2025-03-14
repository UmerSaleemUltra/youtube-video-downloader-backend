import express from 'express';
import ytdl from 'ytdl-core';

const app = express();
app.use(express.json());


app.get('/api/download/youtube', async (req, res) => {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: '18' }) || ytdl.chooseFormat(info.formats, { quality: 'highest' });

    res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    ytdl(url, { format }).pipe(res);
  } catch (error) {
    console.error('Download error:', error.message);
    res.status(500).send('Error downloading YouTube video');
  }
});


