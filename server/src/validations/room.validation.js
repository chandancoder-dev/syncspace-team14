const validateRoom = (data) => {
  const { name } = data;

  if (!name || name.trim() === "") {
    return "Room name is required";
  }

  return null;
};

export default validateRoom;
