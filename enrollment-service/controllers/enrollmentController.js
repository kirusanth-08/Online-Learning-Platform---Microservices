const Enrollment = require('../models/enrollment');

const enrollmentController = {
    enrollCourse: async (req, res) => {
          
        try {
            const alreadyEnrolled = await Enrollment.find({ user_id: req.body.user_id, course_id: req.body.course_id });
            if (alreadyEnrolled.length > 0) {
                return res.json({ message: 'Already enrolled' });
            }    
            const enrollment = new Enrollment(req.body);
            await enrollment.save();
            res.status(201).json({enroll : enrollment});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateEnrollStatus: async (req, res) => {
        try {
            const alreadyEnrolled = await Enrollment.find({ course_id: req.params.courseId, user_id: req.params.studentId });
           
             
            if (!alreadyEnrolled || alreadyEnrolled.length === 0) {
                return res.json({ message: 'You have not enrolled in this course yet.' });
            }
    
            const updateStatus = req.body.status;
    
            // Iterate over each enrollment and update its status
            for (let enrollment of alreadyEnrolled) {
                enrollment.status = updateStatus;
                await enrollment.save();
            }
    
            res.status(200).json({ message: 'Enrollment status updated successfully.' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    
    getEnrollments: async (req, res) => {
        try {
            const enrollments = await Enrollment.find();
            res.json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getEnrolledStudents: async (req, res) => {
        try {
            const enrollments = await Enrollment.find({ courseId: req.params.courseId });
            const studentIds = enrollments.map(enrollment => enrollment.user_id);
            res.json(studentIds);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getEnrolledCourses: async (req, res) => {
        try {
            // console.log(req.params.id)
            const enrollments = await Enrollment.find({ user_id: req.params.id });
          
            const courseIds = enrollments.map(enrollment => enrollment.course_id);
            res.json({message : courseIds});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    unEnrollCourse: async (req, res) => {
        // res.send('unEnrolled')
        try {
            console.log(req.body); // Ensure you're receiving the data correctly
            const { user_id, course_id } = req.body;
           
            await Enrollment.findOneAndDelete({ user_id, course_id });
            res.json({ message: 'Deleted Enrollment' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getEnrollmentCount: async (req, res) => {
        try {
            const count = await Enrollment.countDocuments();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getEnrollmentCountLastWeek: async (req, res) => {
        try {
            const lastWeekStart = new Date();
            lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Calculate the date 7 days ago

            const count = await Enrollment.aggregate([
                {
                    $match: {
                        enrollment_date: {
                            $gte: lastWeekStart, // Filter for enrollment dates greater than or equal to last week start date
                            $lte: new Date() // Filter for enrollment dates less than or equal to current date (today)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 } // Count the documents in the filtered result
                    }
                }
            ]);

            const totalCount = count.length > 0 ? count[0].count : 0;
            res.json({ count: totalCount });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = enrollmentController;