export default function TabPanel({ name, children, value, index, swipeable, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={!swipeable && value !== index}
      id={`${name}-tabpanel-${index}`}
      aria-labelledby={`${name}-tab-${index}`}
      {...other}
    >
      {swipeable || value === index ? children : null}
    </div>
  );
}
