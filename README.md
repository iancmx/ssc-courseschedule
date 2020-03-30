# ssc-courseschedule

A SSC (Student Service Center) course schedule scraper.
This project is a Node.js scraper that scrapes information from all courses and sections offered UBC's SSC. The scraped data is then stored in a MongoDB cluster.  

## Getting Started
To get the project up and running, git clone the repository and run
```
npm install
npm start
```
The program would then start scraping data from ssc and store the data into a mongoDB cluster. 

## Using the scraper functions
To use the scraper functions, import `courseSchedule.js` into your project.

## Relevant functions
The main scraper functions are located in `courseSchedule.js`:

| Function | Return |Example|
|----------|--------|-------|
| getSubjects (year, session) | returns an array of strings containing subjects offered during that year and session |getSubjects('2019', 'W')|
|getCourses (subject, year, session)|returns an array of strings containing courses offered for that subject during that year and session| getCourses('CPEN', '2019','W')|
|getCourseSections (course, subject, year, session)| returns an array of strings containing sections offered for that course during that year and session| getCourseSections('391', 'CPEN', '2019','W')|
|getCourseSectionDetails (section, course, subject, year, session)|returns a Section object|getCourseSectionDetails ('201', '391', 'CPEN', '2019','W') | 




## Section Object
The Section object begin stored is structured as below:

    const Section = new mongoose.Schema({
      subject: String,
      course: String,
      section: String,
      year: Number,
      session: String,
      title: String,
      description: String,
      activity: String,
      creditdf: Boolean,
      credits: Number,
      location: String,
      term: String,
      duration: {
        start: Date,
        end: Date,
      },
      classes: [
        {
          term: String,
          day: String,
          startTime: String,
          endTime: String,
          building: String,
          room: String,
        },
      ],
      instructors: [String],
    });
