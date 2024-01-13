import { useState ,useEffect} from 'react';
import './App.css';
import axios from "axios";
import ImageModal from './imagemodel'; 
import {RiDeleteBin5Line} from 'react-icons/ri';

export default function App() {
  
  const [image, setImage] = useState(null);
  const [allimages , setallimages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [upload , setupload] = useState(false);
  
  const handleFileChange = (e) => {
    // When the user selects a file, capture its
    
    setImage(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setupload(true);
    try {
      const formData = new FormData();
      formData.append('file', image); // Use the selected file

      const response = await axios.post(
        'https://image-gellery-backend.rahulpal5.repl.co/api/v1/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);

      // Reset the form after submission
      setImage(null);
    } catch (error) {
      console.error(error.response);
    }
    setupload(false);
  }

  // console.log(allimages);

  // Function to open the modal
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  const deletehandlerupadte = (id) => {
    // Assuming that allimages is an array of image objects
    // and you want to remove the image with a specific id
    const updatedImages = allimages.filter((image) => image._id !== id);

    // Update the state with the modified image list
      setallimages(updatedImages);
  };

  function deletehandler(id){
    console.log("delete Handler");
    axios.delete(`https://image-gellery-backend.rahulpal5.repl.co/api/v1/deleteimage/${id}`)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error.response.data);
      });
      deletehandlerupadte(id);
  }

  useEffect(() => {
    // Make a GET request to fetch all images
    axios.get('https://image-gellery-backend.rahulpal5.repl.co/api/v1/allimage')
      .then((response) => {
        // Update the state with the fetched images
        // console.log(response.data.conatct);
        setallimages(response.data.conatct); // Assuming the images are in the 'conatct' property of the response
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
        console.error('Request failed:', error.message);
        console.error('Response status:', error.response ? error.response.status : 'No response');
        console.error('Response data:', error.response ? error.response.data : 'No response data');
      });
  }, [image]);
  // The empty dependency array ensures this runs once when the component mounts
  
  return (
    <main>
      <h2>Image Gallery</h2>
      <div className="gallery">
        {
          allimages.map((image,i)=>{
            return(
              <div key={i} className='image'>
              <img  src={image.image} onClick={() => openModal(image.image)}/>
              <p className='date'>Date:- {image.Date.split("T")[0]}</p>
              <RiDeleteBin5Line onClick={()=> deletehandler(image._id)} className='deletebtn' />
              </div>
            )
          })
        }
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label className="custom-file-label">
              Choose a File
              <input className="custom-file-input" type="file" onChange={handleFileChange} />
            </label>
            <button type="submit">Upload</button>
          </form>
        </div>
      </div>
      {
        upload && (
          <div className='uploading'>Uploading Image</div>
        )
      }
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeModal} />
      )}
    </main>
  )
}
