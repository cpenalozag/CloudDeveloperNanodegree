import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { filterImageFromURL, deleteLocalFiles, isValidURL } from './util/util';

(async () => {

  const app = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  /**************************************************************************** */
  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;
    let files: string[] = [];

    if (!image_url || !isValidURL(image_url)) {
      return res.status(400).send({ message: 'Image URL is missing or not valid.' });
    }

    let filteredImagePath = await filterImageFromURL(image_url);

    if (!filteredImagePath) {
      return res.status(422).send({ message: 'The image could not be processed.' });
    }
    else {
      files.push(filteredImagePath);
      res.status(200).sendFile(filteredImagePath, function (err) {
        deleteLocalFiles(files);
        if (err) {
          return res.status(500).send({ message: 'There was a problem sending the image.' });
        }
      });
    }
  });

  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/hola/:id", async (req: Request, res: Response) => {
    res.send("try hola")
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();