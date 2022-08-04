import React from "react";
import {
  Container,
  SwipeableDrawer,
  List,
  ListItem,
  Link,
  AppBar,
  Toolbar,
  Divider,
  IconButton,
  Box,
} from "@mui/material/";
import { CssBaseline, Typography } from "@mui/material/";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Seo from "../components/Seo";
import { NavLink } from "react-router-dom";

const navLinks = [
  { name: "Import", href: "/" },
  { name: "Control report", href: "/control/" },
  { name: "Sample report", href: "/report/" },
  { name: "Help", href: "/help/" },
];

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const linkStyle = (isActive) => {
    return {
      marginRight: 20,
      color: isActive ? "#FFFFFF" : "#ff0000",
      display: { xs: "none", sm: "block" },
    };
  };

  return (
    <div>
      <CssBaseline />
      <Seo />
      <AppBar position="sticky">
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <Typography variant="h3">RonaQC</Typography>
            {navLinks.map((item) => (
              <NavLink key={item.name} to={item.href} style={linkStyle}>
                <Typography>{item.name}</Typography>
              </NavLink>
            ))}
            <Box component={Link} sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <div>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.name}>
                <Link
                  key={item.name}
                  color="textPrimary"
                  variant="button"
                  underline="none"
                  href={item.href}
                >
                  {item.name}
                </Link>
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>
      </AppBar>

      {children}
    </div>
  );
};
export default Layout;
