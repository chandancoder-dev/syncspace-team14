const validateRoom = (data) => {
  const { name, description, language, visibility } = data;

  if (!name || name.trim() === "") {
    return "Room name is required";
  }

  if (!description || description.trim() === "") {
    return "Description is required";
  }

  if (!language || language.trim() === "") {
    return "Language is required";
  }

  if (!visibility) {
    return "Visibility is required";
  }

  if (visibility !== "Public" && visibility !== "Private") {
    return "Visibility must be Public or Private";
  }

  return null;
};

export default validateRoom;
