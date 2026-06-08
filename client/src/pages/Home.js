import React from 'react';

import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';

import SectionHeading from '../components/UI/SectionHeading/SectionHeading';
import Button from '../components/UI/Button/Button';

import CourseCarousel from '../components/Course/CourseCarousel/CourseCarousel';

import pythonLogo from '../components/Course/CourseCarousel/assets/Python.png';
import excelLogo from '../components/Course/CourseCarousel/assets/Excel.png';

const Home = () => {

    const dummyCourses = [
        { id: 1, title: 'Основи Python', reviews: 75, image: pythonLogo },
        { id: 2, title: 'Excel для бізнесу', reviews: 140, image: excelLogo },
        { id: 1, title: 'Основи Python', reviews: 75, image: pythonLogo },
        { id: 2, title: 'Excel для бізнесу', reviews: 140, image: excelLogo },
        { id: 1, title: 'Основи Python', reviews: 75, image: pythonLogo },
        { id: 2, title: 'Excel для бізнесу', reviews: 140, image: excelLogo },
        { id: 1, title: 'Основи Python', reviews: 75, image: pythonLogo },
        { id: 2, title: 'Excel для бізнесу', reviews: 140, image: excelLogo },
        { id: 1, title: 'Основи Python', reviews: 75, image: pythonLogo },
        { id: 2, title: 'Excel для бізнесу', reviews: 140, image: excelLogo }

    ];

    return (
        <div className="app-container">
            {/* <Header role="Користувач" /> */}

            {/* <main style={{ padding: '40px', flex: '1' }}> */}

            {/*    <SectionHeading title="Контактні дані" />

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <Button text="Створити свій курс" variant="red" />
          <Button text="Погодити" variant="blue" />
        </div>  */}

            {/*   <CourseCarousel
          title="Курси які можна прочитати"
          courses={dummyCourses}
        />

        <CourseCarousel
          title="Курси що потребують модерації"
          courses={dummyCourses}
          variant="moderation"
        />
      </main>*/}

            {/* <Footer /> */}
        </div>
    );
};

export default Home;