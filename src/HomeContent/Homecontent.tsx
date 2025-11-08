import ContactForm from './ContactForm';
import HeroSection from './HeroSection';
import Review from './Review';
import FeaturedBooks from './FeaturedBooks';

function HomeContent() {
  return (
    <div>
      <HeroSection />
      <FeaturedBooks />
      <Review></Review>
      <ContactForm></ContactForm>
      
    </div>
  );
}

export default HomeContent;
