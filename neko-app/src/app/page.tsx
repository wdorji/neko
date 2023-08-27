"use client"

import { Stack, Button, Box, Popover, PopoverTrigger, Image, Text, Avatar, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const languageTranslations = {
  "header": {
    "english": "Pick your nekor!",
    "dzongkha": "གནས་སྐོར་གདམ་ཁ་རྐྱབ་གནང།"
  }
}
function HeadingAnimation() {
  const [isEnglish, setIsEnglish] = useState(true);

  // in the background, every 4 seconds, switch language
  useEffect(() => {
    const interval = setInterval(() => {
      setIsEnglish((prevLang) => !prevLang);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Variants specify the hidden and visible states of text 
  const HeaderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box>
      <AnimatePresence mode="wait">
        <motion.div
          key={isEnglish ? "english" : "dzongkha"}
          variants={HeaderVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 1 }}
        >
          <Text fontSize='6xl' as={"span"}>
            {isEnglish ? languageTranslations["header"]["english"] : languageTranslations["header"]["dzongkha"]}
          </Text>
        </motion.div>
      </AnimatePresence>
      </Box>
    </div>
  );
};

function GenerateNekoPanel(title: string, description: string, imgPath: string, id: string) {
  return (<><Popover trigger={'hover'} placement={'bottom-start'}>
    <PopoverTrigger>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          w='90%'
          as="a"
          p={2}
          href={"/map?id="+id }
          border="2px solid black"
        >
          <Image
            objectFit='cover'
            overflow='hidden'
            w={"100%"}
            alignContent={"center"}
            h={"300px"}
            src={imgPath}
            alt='Caffe Latte'
          />

          <Stack>
            <CardBody>
              <Heading size='md'>{title}</Heading>

              <Text py='2'>
                {description}
              </Text>
            </CardBody>

          </Stack>
        </Card>

      </div>
    </PopoverTrigger>
  </Popover></>)
};

function App() {
  return <Stack direction='column' spacing={4}>
    <HeadingAnimation></HeadingAnimation>
    {GenerateNekoPanel("Paro Taktshang","Paro Taktsang (སྤ་རོ་སྟག་ཚང་), popularly known as the Tiger's Nest is a sacred Buddhist site located in the cliffside of the upper Paro valley in Bhutan.",'https://images.unsplash.com/photo-1644495949450-9a0fe21b7376?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80', "0")}
    {GenerateNekoPanel("Gangtey Nature Trail","The Gangtey (སྒང་སྟེང) Nature Trail is a gentle two-hour trek that lets you soak up the remarkable Phobjikha Valley starting at Gangtey Monastery. En route, you’ll pass grass planes, farmhouses and dense pine forests before reaching a vast open space of the wide valley.",'https://farm2.staticflickr.com/1677/25769847585_b4aa8f8a43_o.jpg',"1")}
    {GenerateNekoPanel("Singye Dzong","Singye Dzong (སེངྒེ་རྫོང) directly translating into the Lion Fortress is a sacred Buddhist site located at an altitude of over 3800 meters in Lhuentse district of Bhutan near the Bhutan-Tibetan border.",'https://dorjiwangchuk2016.files.wordpress.com/2017/03/singyedzong.jpg', "2")}
    </Stack>
}

export default App;
