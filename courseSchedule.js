const cheerio = require("cheerio");
const axios = require("axios");
const urlBuilder = require("./urlBuilder.js");

const getSubjects = async (year, session) => {
  try {
    const $ = await fetchData(urlBuilder.subjects(year, session));
    const subjectsTable = $(".section1, .section2").find("a");

    const subjects = [];

    subjectsTable.each(function () {
      // subjects[i].attribs.href
      subjects.push($(this)[0].children[0].data);
    });

    return subjects;
  } catch (err) {
    console.log("getSubject error: " + year + ", " + session);
    console.log(err);
  }
};

const getCourses = async (subject, year, session) => {
  try {
    const $ = await fetchData(
      urlBuilder.subjectCourses(subject, year, session)
    );
    const coursesTable = $(".section1, .section2").find("a");
    const courses = [];

    coursesTable.each(function () {
      // coursesTable[i].attribs.href
      courses.push($(this)[0].children[0].data.split(" ")[1]);
    });

    return courses;
  } catch (err) {
    console.log("getCourses error: " + subject + ", " + year + ", " + session);
    console.log(err);
  }
};

const getCourseSections = async (course, subject, year, session) => {
  try {
    const $ = await fetchData(
      urlBuilder.courseSections(course, subject, year, session)
    );
    const sectionTable = $(".section1, .section2")
      .find("a")
      .not(".accordion-toggle, .section-comments *"); // Exclude .accordion to exclude section notes
    const sections = [];

    sectionTable.each(function () {
      // sectionTable[i].attribs.href
      sections.push($(this)[0].children[0].data.split(" ")[2]);
    });

    return sections;
  } catch (err) {
    console.log(
      "getCourseSections error: " +
        course +
        ", " +
        subject +
        ", " +
        year +
        ", " +
        session
    );
    console.log(err);
  }
};

const getCourseSectionDetails = async (
  section,
  course,
  subject,
  year,
  session
) => {
  const parseStringDates = (date) => {
    const getMonthFromString = (month) => {
      return new Date(Date.parse(month + " 1, 2012")).getMonth() + 1;
    };

    let dateArr = date.split(" ");

    dateArr[0] = getMonthFromString(dateArr[0]);

    return new Date(dateArr[2], dateArr[1], dateArr[0]);
  };

  let coursesection = {};

  // console.log(urlBuilder.course(section, course, subject, year, session));
  const $ = await fetchData(
    urlBuilder.course(section, course, subject, year, session)
  ).catch((err) => {
    console.log(
      "Error fetching details for: " +
        section +
        " " +
        course +
        " " +
        subject +
        " " +
        year +
        " " +
        session
    );
    console.log(urlBuilder.course(section, course, subject, year, session));
    console.log(err);
    return;
  });

  coursesection.subject = subject;
  coursesection.course = course;
  coursesection.section = section;
  coursesection.year = year;
  coursesection.session = session;
  coursesection.title = $("h5")[0].children[0].data;
  coursesection.description = $("h5")[0].next.children[0].data;
  coursesection.activity = $("h5")[0].prev.children[0].data.match(
    /\(([^)]+)\)/
  )[1];

  // some credit/d/f depends on eligibility of the course
  try {
    coursesection.creditdf = !$(
      "#cdfText"
    )[0].children[0].children[0].data.includes("not eligible");
  } catch (err) {
    coursesection.creditdf = undefined;
  }

  const credits = $("#cdfText")[0].next.children[0].data.match(/(\d+)/);

  coursesection.credits = credits ? credits[0] : null;
  coursesection.location = $("#cdfText")[0].next.next.children[0].data.split(
    ":  "
  )[1];
  coursesection.term = $("#cdfText")[0].next.next.next.children[0].data.split(
    " "
  )[1];

  const durationDates = $("#cdfText")[0]
    .next.next.next.next.data.match(/\(([^)]+)\)/)[1]
    .replace(/,/g, "")
    .split(" to ");

  coursesection.duration = {
    startDate: parseStringDates(durationDates[0]),
    endDate: parseStringDates(durationDates[1]),
  };

  // Skip if section does not have timetable
  if ($(".table.table-striped").length > 1) {
    const classesTable = $($(".table.table-striped")[0])
      .find("tbody")
      .find("tr");

    const classes = [];

    classesTable.each(function () {
      const schedule = {};

      // Exclude the notes where courses are alternate weeks
      if ($(this)[0].children[0].children[0].data.includes("alternate weeks")) {
        return false;
      }

      try {
        schedule.term = $(this)[0].children[0].children[0].data;
        schedule.day = $(this)[0].children[1].children[0].data.trim();
        schedule.startTime = $(this)[0].children[2].children[0].data;
        schedule.endTime = $(this)[0].children[3].children[0].data;
        schedule.building = $(this)[0].children[4].children[0].data;

        if ($(this)[0].children[5].children[0]) {
          // Check if room is hyperlinked
          if ($(this)[0].children[5].children[0].children) {
            schedule.room = $(this)[0].children[5].children[0].children[0].data;
          } else {
            schedule.room = $(this)[0].children[5].children[0].data;
          }
        } else {
          schedule.room = "";
        }
        classes.push(schedule);
      } catch (err) {
        console.log(
          "Error getting timetable from: " +
            section +
            " " +
            course +
            " " +
            subject +
            " " +
            year +
            " " +
            session
        );
        console.log(urlBuilder.course(section, course, subject, year, session));
        console.log(err);
      }
    });

    coursesection.classes = classes;

    const instructorsTable = $($(".table.table-striped")[0].next).find("a");

    const instructors = [];
    instructorsTable.each(function () {
      instructors.push($(this)[0].children[0].data);
    });

    coursesection.instructors = instructors;
  }

  // console.log(coursesection);
  return coursesection;
};

const fetchData = async (url) => {
  const html = await axios.get(url);
  return cheerio.load(html.data);
};

// getSubjects("2019", "W").then(async (subjects) => {
//   for (k = 0; k < subjects.length; k++) {
//     courses = await getCourses(subjects[k], "2019", "W");
//     for (let i = 0; i < courses.length; i++) {
//       console.log(courses[i]);
//       sections = await getCourseSections(courses[i], subjects[k], "2019", "W");
//       for (let j = 0; j < sections.length; j++) {
//         console.log(sections[j]);
//         await getCourseSectionDetails(
//           sections[j],
//           courses[i],
//           subjects[k],
//           "2019",
//           "W"
//         );
//       }
//     }
//   }
// });

// getCourses("CPEN", "2019", "W").then(async (courses) => {
// 	for (let i = 0; i < courses.length; i++) {
// 		console.log(courses[i].split(' ')[1])
// 		sections = await getCourseSections(courses[i].split(' ')[1], "CPEN", "2019", "W");
// 		for (let j = 0; j < sections.length; j++) {
// 			console.log(sections[j].split(' ')[2])
// 			await getCourseSectionDetails(sections[j].split(' ')[2], courses[i].split(' ')[1], "CPEN", "2019", "W");
// 		}
// 	}
// })

// getCourseSectionDetails(
//   "101",
//   "112",
//   "BIOL",
//   "2019",
//   "W"
// ).then((sectionDetails) => console.log(sectionDetails));
// getCourses("CPEN", 2019, "W").then(courses => console.log(courses));
getCourseSections("101", "FIPR", "2019", "W").then(sections => console.log(sections));

module.exports = {
  getSubjects,
  getCourses,
  getCourseSections,
  getCourseSectionDetails,
};
