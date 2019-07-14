import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Proptypes from "prop-types";
import { Link } from "react-router-dom";
import isURL from "validator/lib/isURL";
import { ErrorContext } from "../contexts/ErrorContext.jsx";
import config from "../config";
import StyledSubmit from "./Submit.style";
import { Box } from "../components/Box.style";
import { Input } from "../components/Input.style";
import { Button, ButtonError } from "../components/Button.style";
import { Header, Error, Warning } from "../Typography/Typography.style";
import getYoutubeId from "../../util/getYoutubeId";

const siteUrl = config.url;

export default function Submit({ history }) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // list of available images
  const [imageLoading, setImageLoading] = useState(false);
  const [customImage, setCustomImage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [tag, setTag] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [validation, setValidation] = useState({});
  const { setErrors } = useContext(ErrorContext);

  useEffect(() => {
    const error = [];

    if (isURL(url)) {
      const videoId = getYoutubeId(url);
      if (!videoId) {
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
          });
      } else {
        const imageTemplate = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        setImages([imageTemplate]);
      }
    } else {
      setImages([]);
      error.push("You must give your post a valid url!");
    }

    error.length
      ? setValidation(v => ({ ...v, url: error }))
      : setValidation(v => ({ ...v, url: "" }));
    setSelectedImages([]);
  }, [url]);

  const handleSubmit = e => {
    e.preventDefault();
    const valid = Object.keys(validation).filter(k => validation[k]).length === 0;

    if (!valid) return;

    const data = {
      description,
      images: selectedImages,
      link: url,
      title,
      tagInput
    };

    axios
      .post(`${siteUrl}/post/post`, data)
      .then(res => {
        if (res.data.errors) setErrors(errors => [...errors, res.data]);
        else {
          setDescription("");
          setImages([]);
          setSelectedImages([]);
          setTagInput("");
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
    else
      setErrors(errors => [
        ...errors,
        { type: "Error", errors: "You can't select more than 10 images!" }
      ]);
  };

  const handleOnImageLoad = ({ target: image }, index) => {
    if (
      !images[index].includes("https://img.youtube.com/vi/") &&
      (image.naturalWidth < 500 || image.naturalHeight < 500)
    ) {
      setImages(images => images.filter(img => img !== index));
      setSelectedImages(images => images.filter(img => img !== index));
    }
  };

  const handleTagRemove = tagToRemove =>
    setTagInput(tags => tags.split(",").filter(tag => tag !== tagToRemove).join(","));

  const handleTagInput = e => {
    if (e.key === "," || e.key === "Enter") {
      if (!tagInput.split(",").includes(tag) && tag)
        setTagInput(tags => `${tags ? `${tags}","` : ""}${tag}`);
      setTag("");
    }
  };

  const handleOnImageError = image => {
    setImages(images => images.filter(img => img !== image));
    setSelectedImages(images => images.filter(img => img !== image));
  };

  useEffect(() => {
    const error = [];
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
        images: ["Your post needs at least 1 image."]
      }));
    else {
      setValidation(v => ({ ...v, images: "" }));

      const newImages = selectedImages.filter(
        image => !images.includes(image)
      );

      newImages.length > 0 && setImages(images => [...images, ...newImages]);
    }
  }, [selectedImages, images]);

  useEffect(() => {
    const error = [];
    if (
      !tagInput ||
      !tagInput.includes(",") ||
      tagInput.split(",").length < 3 ||
      tagInput.split(",").filter(t => t).length < 3
    )
      error.push(
        'You must give at least 3 (non-empty) tags to your post (separated by ",")!'
      );
    else if (tagInput.split(",").length > 30)
      error.push(
        `Your post can't have more than 30 tags: please remove ${tagInput.split(
          ","
        ).length - 30} of them!`
      );
    error.length > 0
      ? setValidation(v => ({ ...v, tags: error }))
      : setValidation(v => ({ ...v, tags: "" }));
  }, [tagInput]);

  useEffect(() => {
    const error = [];
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
    <Box style={{ width: "100%" }}>
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
        {images.length !== 0 && (
          <Header className="label" size={1} centered>
            Choose an image
          </Header>
        )}
        {images.length === 0 && url && !imageLoading && (
          <Error className="image-text">
            Couldn't find any images on the url (you can instead add your own
            choice of url below).
            <br /> Only images bigger than 500*500 px are valid.
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
        {tagInput && <ul className="input input--text tag-list">
          {tagInput.split(",").filter(tag => tag).map(tag => (
            <li key={tag} className="tag" onClick={() => handleTagRemove(tag)}>
              {tag}
            </li>
          ))}
        </ul>}
        <Input
          className="input input--text input--tags"
          onChange={e => e.currentTarget.value.slice(-1) !== "," && handleInput(e, setTag)}
          onKeyPress={e => handleTagInput(e)}
          value={tag}
        />
        {Object.keys(validation).filter(k => validation[k]).length !== 0 ? (
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
              validation.images &&
              validation.images.map(e => (
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
          <Button
            as={Link}
            className={"button"}
            onClick={e => handleSubmit(e)}
            to="/add"
          >
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
