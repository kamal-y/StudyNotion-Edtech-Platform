const Section = require('../models/Section');
const Course = require('../models/Course');
// const SubSection = require("../models/SubSection");
const SubSection = require("../models/SubSection");
//------------------------------------------------------------- Create Section------------------------------------------------


exports.createSection = async(req, res) => {
    try {
        //Data Fetch 
        console.log("Controller/Section")
        const {sectionName, courseId} = req.body;

        // Validation 
        if(!sectionName || !courseId){
            return res.status(404).json({
                success: false,
                message: 'All Fields are Required',
            });
        }
        console.log("Controller/Section1")
        // create Section 
        const newSection = await Section.create({sectionName});
        console.log("Controller/Section2", newSection)
        // Update Course with section ObjectId
        const updateCourse = await Course.findByIdAndUpdate(courseId, 
                                                                {
                                                                    $push: {
                                                                        courseContent: newSection._id
                                                                    }

                                                                },
                                                                {new: true},
                                                            )
                                                            .populate({
                                                                path: "courseContent",
                                                                populate: {
                                                                    path: "subSection",
                                                                },
                                                            })
                                                            .exec();

        // Return response
        return res.status(200).json({
            success: true,
            message: "Section Creates Successfully",
            updateCourse, 
        })

    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, Please try again",
            error: error.message
        })
    }
}

//-------------------------------------------------------- Updata a Section------------------------------------------------------

exports.updateSection = async(req, res) => {
    try {
        
        // Fetch Data
        const {sectionName, sectionId, courseId} = req.body;

        // Data Validation
        // if(!sectionName || !sectionId){
        //     return res.status(404).json({
        //         success: false,
        //         message: 'All fields are Required'
        //     });
        // }

        // Update Data
        // sectionId ke Help se SectionName change Kiya 
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate:{
                path: "subSection",
            },
        })
        .exec();

        // Response
        return res.status(200).json({
            success: true,
            message: section,
            data: course,
        });


    } 
    catch (error) {
        console.log("Error Updating Course", error);
        return res.status(500).json({
            success: false,
            message: "Error in Updating Section",
            error: error.message,
        })    
    }
}

//-------------------------------------------------------------- Delete Section -------------------------------------------------------

exports.deleteSection = async(req, res) => {
    try {
        // Get Id --> Hume course ki id mil jaegi toh hum delete kr sakte hai
        // Zaroori nahi hai ki Course Name chahiye
        // get id -- assuming that we are sending Id in Params
        // Idhar req.params use kiya hai kyuki /api/section/:sectionId 
        //because of colon(:) req.params use kiya gaya hai
        const {sectionId, courseId} = req.body;  

        // Use Find By Id to delete
        await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
        const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}
        //delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error in Deleting Course",
            error: error.message
        });    
    }
}



