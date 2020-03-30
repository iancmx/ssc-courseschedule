const baseURL = "https://courses.students.ubc.ca/";

const subjectsRoute =
  "cs/courseschedule?pname=subjarea&tname=subj-all-departments";
const subjectCoursesRoute =
  "cs/courseschedule?tname=subj-department&pname=subjarea";
const courseSectionsRoute =
  "cs/courseschedule?pname=subjarea&tname=subj-course";
const courseRoute = "cs/courseschedule?pname=subjarea&tname=subj-section";

const subjects = (year, session) => {
  return baseURL + subjectsRoute + "&sessyr=" + year + "&sesscd=" + session;
};

const subjectCourses = (subject, year, session) => {
  return (
    baseURL +
    subjectCoursesRoute +
    "&sessyr=" +
    year +
    "&sesscd=" +
    session +
    "&dept=" +
    subject
  );
};

const courseSections = (course, subject, year, session) => {
  return (
    baseURL +
    courseSectionsRoute +
    "&sessyr=" +
    year +
    "&sesscd=" +
    session +
    "&dept=" +
    subject +
    "&course=" +
    course
  );
};

const course = (section, course, subject, year, session) => {
  return (
    baseURL +
    courseRoute +
    "&sessyr=" +
    year +
    "&sesscd=" +
    session +
    "&dept=" +
    subject +
    "&course=" +
    course +
    "&section=" +
    section
  );
};

module.exports = {
  subjects,
  subjectCourses,
  courseSections,
  course,
};
