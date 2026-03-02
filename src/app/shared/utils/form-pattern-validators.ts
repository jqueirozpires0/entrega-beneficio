const cpfValidator = () =>
  new RegExp(/^[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/);

export const formValidatorsUtils = {
  cpfValidator,
};
