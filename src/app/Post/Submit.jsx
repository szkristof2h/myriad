import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Proptypes from "prop-types";
import { Link } from "react-router-dom";
import isURL from "validator/lib/isURL";
import { ErrorContext } from "../contexts/ErrorContext.jsx";
import config from "../config";
import StyledSubmit from "./Submit.style"
import { Box } from "../components/Box.style"
import { Input } from "../components/Input.style"
import { Button, ButtonError } from "../components/Button.style";
import { Header, Error, Warning } from "../Typography/Typography.style"

const siteUrl = config.url;

export default function Submit({ history }) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // list of available images
  const [imageLoading, setImageLoading] = useState(false);
  const [customImage, setCustomImage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [validation, setValidation] = useState({});
  const { setErrors } = useContext(ErrorContext);

  useEffect(() => {
    if(isURL(url)) {
      setImageLoading(true);
      axios
        .post(`${siteUrl}/get/images`, { url })
        .then(res => {
          const html = res.data;
          const parser = new DOMParser();
          const wrapper = parser.parseFromString(html, "text/html");
          const imgs = [...wrapper.getElementsByTagName("img")]
            .map(a => a.src)
            .filter((img, i, self) => self.indexOf(img) === i);
          setImages(imgs);
          setImageLoading(false);
        })
        .catch(e => {
          setErrors(errors => [...errors, e.response.data]);
          setImageLoading(false);
        })
      } else setImages([]);

    let error = [];
    if (!isURL(url)) error.push("You must give your post a valid url!");
    error.length > 0
      ? setValidation(v => ({ ...v, url: error }))
      : setValidation(v => ({ ...v, url: "" }));
    setSelectedImages([]);
  }, [url]);

  const handleSubmit = e => {
    e.preventDefault();
    const valid =
      Object.keys(validation).filter(k => validation[k]).length == 0;

    if (!valid) return;

    const data = {
      description,
      image: selectedImages,
      link: url,
      title,
      tags
    };

    axios
      .post(`${siteUrl}/post/post`, data)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setDescription("");
          setImages([]);
          setSelectedImages([]);
          setTags("");
          setTitle("");
          setUrl("");
          history.push("/");
        }
      })
      .catch(e => setErrors(errors => [...errors, e.response.data]));
  };

  const handleInput = (e, change) => change(e.currentTarget.value);

  const handleImageInput = e => {
    const newImage = e.currentTarget.value;
    if (isURL(newImage)) {
      if (images.includes(newImage)) {
        setCustomImage("");
        setErrors(errors => [
          ...errors,
          {
            type: "Error",
            errors: "Image is already on the list."
          }
        ]);
      } else if (selectedImages.length > 9) {
        setCustomImage("");
        setErrors(errors => [
          ...errors,
          {
            type: "Error",
            errors: "You can only have 10 images for your post."
          }
        ]);
      } else {
        setCustomImage("Image added.");
        setImages(images => [...images, newImage]);
        setSelectedImages(images => [...images, newImage]);
      }
    } else setCustomImage(newImage);
  };

  const handleSelect = (e, clickedImage) => {
    e.preventDefault();
    if (selectedImages.length < 10 || selectedImages.includes(clickedImage))
      setSelectedImages(images =>
        images.includes(clickedImage)
          ? images.filter(image => image !== clickedImage)
          : [...images, clickedImage]
      );
    else {
      setErrors(errors => [
        ...errors,
        { type: "Error", errors: "You can't select more than 10 images!" }
      ]);
    }
  };

  const handleOnImageLoad = ({ target: image }, index) => {
    if (image.naturalWidth < 500 || image.naturalHeight < 500)
      setImages(images => images.filter(img => img !== index));
  }
  
  const handleOnImageError = image => {
    setImages(images => images.filter(img => img !== image));
    setSelectedImages(images => images.filter(img => img !== image));
  }

  useEffect(() => {
    let error = [];
    if (!description) error.push("You must give your post a description!");
    if (description.length < 3)
      error.push("The description should be at least 3 characters long!");
    if (description.length > 300)
      error.push("The description shouldn't be more than 300 characters long!");
    error.length > 0
      ? setValidation(v => ({ ...v, description: error }))
      : setValidation(v => ({ ...v, description: "" }));
  }, [description]);

  useEffect(() => {
    if (selectedImages.length === 0)
      setValidation(v => ({
        ...v,
        image: ["Your post needs at least 1 image."]
      }));
    else {
      setValidation(v => ({ ...v, image: "" }));

      const newImages = selectedImages.filter(
        image => !images.includes(image)
      );

      newImages.length > 0 && setImages(images => [...images, ...newImages]);
    }
  }, [selectedImages, images]);

  useEffect(() => {
    let error = [];
    if (
      !tags ||
      !tags.includes(",") ||
      tags.split(",").length < 3 ||
      tags.split(",").filter(t => t).length < 3
    )
      error.push(
        'You must give at least 3 (non-empty) tags to your post (separated by ",")!'
      );
    error.length > 0
      ? setValidation(v => ({ ...v, tags: error }))
      : setValidation(v => ({ ...v, tags: "" }));
  }, [tags]);

  useEffect(() => {
    let error = [];
    if (!title) error.push("You must give your post a title!");
    if (title.length < 3)
      error.push("The title should be at least 3 characters long!");
    if (title.length > 50)
      error.push("The title shouldn't be more than 50 characters long!");
    error.length > 0
      ? setValidation(v => ({ ...v, title: error }))
      : setValidation(v => ({ ...v, title: "" }));
  }, [title]);

  return (
    <Box>
      <StyledSubmit>
        <Header className="header" size={2} centered>
          Submit a post!
        </Header>
        <Header className="label" size={1} centered>
          Title
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, setTitle)}
          value={title}
        />
        <Header className="label" size={1} centered>
          Description
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, setDescription)}
          value={description}
        />
        <Header className="label" size={1} centered>
          Link (to the original post)
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, setUrl)}
          placeholder="Will automatically load images from the url to choose from"
          value={url}
        />
        {images.length != 0 && (
          <Header className="label" size={1} centered>
            Choose an image
          </Header>
        )}
        {images.length == 0 && url && !imageLoading && (
          <Error className="image-text">
            Couldn't find any images on the url (you can instead add your own
            choice of url below).<br /> Only images bigger than 500*500 px are valid.
          </Error>
        )}
        {imageLoading && (
          <Warning className="label" size={1} centered>
            Loading images from {url}...
          </Warning>
        )}
        {images.map(image => (
          <Link
            key={image}
            className={`image-container ${
              selectedImages.includes(image) ? "image-container--active" : ""
            }`}
            onClick={e => handleSelect(e, image)}
            to=""
          >
            <img
              onError={() => handleOnImageError(image)}
              onLoad={e => handleOnImageLoad(e, image)}
              className="image"
              src={image}
            />
          </Link>
        ))}
        {url && (
          <Header className="label" size={1} centered>
            Image (url)
          </Header>
        )}
        {url && (
          <Input
            className="input input--text"
            onChange={e => handleImageInput(e)}
            placeholder="Add a custom image or choose from above (after filling link)"
            value={customImage}
          />
        )}
        <Header className="label" size={1} centered>
          Tags
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, setTags)}
          value={tags}
        />
        {Object.keys(validation).filter(k => validation[k]).length != 0 ? (
          <ButtonError as="ul" className="button">
            {validation.title &&
              validation.title.map(e => (
                <li key={e} className="error">
                  {e}
                </li>
              ))}
            {validation.description &&
              validation.description.map(e => (
                <li key={e} className="error">
                  {e}
                </li>
              ))}
            {url &&
              validation.image &&
              validation.image.map(e => (
                <li key={e} className="error">
                  {e}
                </li>
              ))}
            {validation.url &&
              validation.url.map(e => (
                <li key={e} className="error">
                  {e}
                </li>
              ))}
            {validation.tags &&
              validation.tags.map(e => (
                <li key={e} className="error">
                  {e}
                </li>
              ))}
          </ButtonError>
        ) : (
          <Button as={Link} onClick={e => handleSubmit(e)} to="/add">
            Post
          </Button>
        )}
      </StyledSubmit>
    </Box>
  );
}

Submit.propTypes = {
  history: Proptypes.object.isRequired
};
