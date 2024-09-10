import express from 'express';

const router = express.Router();

// Add JSON a route
router.get("/json", (req, res) => {
    const data = {
      data: {
          msg: "Hello World via JSON"
      }
    };
    res.json(data);
  });
  
  // JSON routes med olika metoder: 
  
  router.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request"
        }
    });
  });
  
  router.post("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a POST request"
        }
    });
  });
  
  router.put("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a PUT request"
        }
    });
  });
  
  router.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
  });
  
  // Add dinamic route
  router.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };
  
    res.json(data);
  });

export default router;