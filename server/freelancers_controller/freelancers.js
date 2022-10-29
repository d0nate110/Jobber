const express = require('express');
const router = express.Router();
const FreelancerModel = require('../models/freelancer');
const ResumeModel = require('../models/resume');
const authorization = require('../configuration/authorization');




router.post('/register/freelancers', async (request, response) => {

    
    try {

        const freelancer = new FreelancerModel({

            first_name: request.body.first_name,
            last_name: request.body.last_name,
            email_address: request.body.email_address,
            phone_number: request.body.phone_number,
            description: request.body.description,
            password: request.body.password
        });
        const data = await freelancer.save();
        const token = await freelancer.generateAuthToken();
        response.status(201).json({ data, token });
    }
    catch (error) {
        response.status(400).json({ message: error.message });
    }
});

router.post('/login', async (request, response) => {

    try {

        const freelancer = await FreelancerModel.findByCredentials(request.body.email_address, request.body.password);
        if (!freelancer) {
            return response.status(401).json({ error: "Wrong credentials" });
        }
        const token = await freelancer.generateAuthToken();
        response.status(201).json({ freelancer, token });
    } catch (error) {
        response.status(400).json({ error: "bad request" });
    }
});

router.get('/:id', authorization, async (request, response) => {
    const id = request.params.id;
    await response.json(request.userData);

});



router.get('/freelancers', function (request, response) {

    try {

        FreelancerModel.find({}, function (error, freelancers) {
            if (error) {
                response.send(error)
            }
            response.send(freelancers)
        });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.get('/freelancers/:id', function (request, response) {

    const id = request.params.id;

    if (id == null) {
        return response.status(404).json({ "message": "Id does not exist" });
    }
    try {

        FreelancerModel.find({"_id": id}, function (error, freelancer) {
            if (error) {
                response.send(error)
            }
            response.send(freelancer)
        });
  
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.patch('/freelancers/:id', async (request, response) => {

    const id = request.params.id;
    const body = request.body;

    try {

        const updateFreelancer = await FreelancerModel.findByIdAndUpdate(id, body);
    
        response.json(updateFreelancer);
     } catch (error) {
         response.status(500).json({ message: error.message });
     };
});


router.put('/freelancers/:id', async (request, response) => {

    const id = request.params.id;

    try {
        FreelancerModel.findById(id, function(err, freelancer) {
            if (err) { response.status(409).json({'message': 'freelancer update failed!', 'error': err}); }
            if (freelancer === null) {
                return response.status(404).json({'message': 'Freelancer not found'});
            }
            freelancer.first_name = request.body.first_name;
            freelancer.last_name = request.body.last_name;
            freelancer.email_address = request.body.email_address;
            freelancer.phone_number = request.body.phone_number;
            freelancer.description = request.body.description;
            freelancer.resume = request.body.resume;
            freelancer.password = request.body.password;
    
            freelancer.save();
            response.json(freelancer);
        });

     } catch (error) {
         response.status(500).json({ message: error.message });
     };
});

router.delete('/freelancers/:id', async (request, response) => {

    const id = request.params.id;

    try {

        const deletedFreelancer = await FreelancerModel.findByIdAndRemove(id).exec();
        response.send(deletedFreelancer);
    
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post('/freelancers/:id/resumes', async (request, response) => {
    const id = request.params.id;
    const resume = request.body.resume;


    try {

        const createResume = await ResumeModel.create({
            
            education_field: request.body.education_field,
            experience_field: request.body.experience_field,
            skills_field: request.body.skills_field,
            freelancer: id
        })
        

        const createdResume = await createResume.save();

        
        FreelancerModel.findByIdAndUpdate({ "_id": id }, { $push: { resume: createdResume } }, { safe: true, upsert: true }, function (error, resume) {
            if (error) {
                response.send(error);
            } else {
                response.json(resume);
            }
        });
            
    } catch (error) {
        
        
        response.status(400).json({ message: 'Please fill all the fields' });
    }

});

router.get('/freelancers/:id/resumes', async (request, response) => {

    const id = request.params.id;

    try {

            ResumeModel.find({ "freelancer": id}, function (error, resumes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json(resumes);
                }
            })
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.get('/freelancers/:id/resumes/:id', async (request, response) => {

    const id = request.params.id;

    try {

        ResumeModel
            .findOne({ "_id": id }, function (error, resume) {
                if (error) {
                    response.send(error);
                }
                response.json(resume);
            })
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete('/freelancers/:id/resumes/:id', async (request, response) => {

    const id = request.params.id;
  
    try {

        ResumeModel
            .findOneAndDelete(id)
            .then(function (error, delResume) {
                if (error) {
                    response.send(error);
                }
                response.json(delResume);
            });
    
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




module.exports = router;
