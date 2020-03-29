const Section = require("./models/Section");
const courseScheduleAPI = require("./courseSchedule");

const updateDB = async (year, session) => {
  await courseScheduleAPI.getSubjects(year, session).then(async (subjects) => {
    for (k = 0; k < subjects.length; k++) {
      courses = await courseScheduleAPI.getCourses(subjects[k], year, session);
      for (let i = 0; i < courses.length; i++) {
        // console.log(courses[i]);
        sections = await courseScheduleAPI.getCourseSections(
          courses[i],
          subjects[k],
          year,
          session
        );
        for (let j = 0; j < sections.length; j++) {
          // console.log(sections[j]);
          try {
            courseScheduleAPI
              .getCourseSectionDetails(
                sections[j],
                courses[i],
                subjects[k],
                year,
                session
              )
              .then(async (sectionDetails) => {
                let section = await Section.findOneAndUpdate(
                  {
                    subject: sectionDetails.subject,
                    course: sectionDetails.course,
                    section: sectionDetails.section,
                    year: sectionDetails.year,
                    session: sectionDetails.session,
                  },
                  sectionDetails,
                  {
                    new: true,
                    upsert: true,
                  },
                  (err, section) => {
                    if (err) {
                      console.log(err);
                      console.log(section);
                    }
                  }
                );
              });
          } catch (err) {
            console.log(
              "Error on: " +
                " " +
                sections[j] +
                " " +
                courses[i] +
                " " +
                subjects[k] +
                " " +
                year +
                " " +
                session
            );
          }
        }
      }
    }
  });
  console.log("Update Complete");
};

module.exports = {
  updateDB,
};
