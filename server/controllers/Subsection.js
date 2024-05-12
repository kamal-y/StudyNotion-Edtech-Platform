const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const { uploadImageToCloudinary } = require('../utils/imageUploader');


//------------------------------------------------------- Create SubSection--------------------------------------------------

exports.createSubSection = async(req, res) => {
    try {
        // Fetch data from req body
        const {sectionId, title, description} = req.body;

        // Extract file / videos
        const video = req.files.video;
        // validation
        if(!sectionId || !title  || !description || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are Required"
            });
        }

        // Upload video to Cloudnary -- secure_url
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log(uploadDetails)

        // create a subsection
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.timeDuration}`,
            description: description,
            videoUrl: uploadDetails.secure_url 
        });

        // update section with this subsection ObjectId
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId}, 
                                                                {   
                                                                    $push: {
                                                                        subSection: subSectionDetails._id,
                                                                    }
                                                                },
                                                                {new: true}
                                                            ).populate('subSection').exec();

        
        // return response
        return res.status(200).json({
            success: true,
            data:updateSection,
            message: "Subsection Created Successfully",
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Creating SubSection",
            error: error.message 
        });    
    }
}

//------------------------------------------------------- Update Subsection------------------------------------------------------
exports.updateSubSection = async(req, res) => {
    try {
        // 1.Fetch title and Subsection id from the req.body
        const {title, subSectionId, sectionId, description} = req.body;
        const subSection = await SubSection.findById(subSectionId);
    
        // 2.Validate
        if(!subSection){
            return res.status(400).json({
                success: true,
                message: "SubSection not found"
            });
        }

        if (title !== undefined) {
            subSection.title = title
        }
      
        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();
        // 3.Update Operation
        // SubsectionId ke Help se Subsection change kiya
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // 4.Return response
        return res.status(200).json({
            success: true,
            data: updatedSection,
            message: "SubSection Updated Successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Updating SubSection"
        });
    }
}

//------------------------------------------------------- Delete Subsection------------------------------------------------------
exports.deleteSubSection = async(req, res) => {
    try {
        // 1.Fetch data From req body
        const {subSectionId, sectionId} = req.body;

        // 2.Use find by id and Delete
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull: {
                    subSection: subSectionId,
                },
            }    
        );

        const subSection = await SubSection.findByIdAndDelete({_id: subSectionId});

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // 3.Return response
        return res.status(200).json({
            success: true,
            data:updatedSection,
            message: "SubSection is Deleted"
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Deleting Sub-section"
        });
    }
}