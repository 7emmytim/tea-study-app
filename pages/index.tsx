import { sermons } from "@/data";
import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ArrowRight, Book1 } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const { query } = useRouter();
  const { step } = query;

  function getStep() {
    switch (step) {
      case "1":
        return <Questions />;
      default:
        return <Landing />;
    }
  }

  return <main className="pt-10">{getStep()}</main>;
}

function Landing() {
  const { pathname, query } = useRouter();
  return (
    <Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {sermons.map((item, index) => {
          return (
            <Card
              key={index}
              className="bg-gray-100 w-full sm:w-auto"
              radius="lg"
              padding="lg"
              shadow="xl"
              component={Link}
              href={{
                pathname,
                query: {
                  ...query,
                  step: "1",
                  sermon: item.slug,
                  question_number: 1,
                },
              }}
            >
              <Group>
                <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-white flex-shrink-0">
                  <item.icon size={20} variant="Bold" color={item.color} />
                </div>
                <Stack spacing={1}>
                  <Text className="text-gray-900 text-lg title-font font-medium">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-xs">
                    {item.description} ({item.questions.length})
                  </Text>
                </Stack>
              </Group>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

function Questions() {
  const [value, setValue] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [question, setQuestion] = useState<{ q: string; a: string }>({
    q: "",
    a: "",
  });
  const { pathname, query } = useRouter();
  const { sermon, question_number = 0 } = query;
  const details = sermons.find((item) => item.slug === sermon);
  const questions = details?.questions;

  useEffect(() => {
    const q = randomNoRepeats(questions || []);
    setQuestion(q());
  }, [questions, question_number]);

  function checkAnswer(event: FormEvent) {
    event.preventDefault();
    setIsCheck(true);
  }

  function next() {
    setIsCheck(false);
    setValue("");
  }

  if (!questions?.length || Number(question_number) > questions?.length) {
    return <NoQuestionCard />;
  }

  return (
    <Container size="sm" className="flex justify-center w-full">
      <Stack className="w-full">
        <Stack spacing={1}>
          <Title order={3}>
            {details?.title}
            <Text className="text-gray-500 text-xs font-normal">
              ({`${details?.description} - Question ${question_number}`})
            </Text>
          </Title>
        </Stack>
        {isCheck ? (
          <Stack>
            <Card className="bg-gray-100 w-full" shadow="xl" padding={40}>
              <Stack spacing={50}>
                <Title>{question?.q}</Title>
                <Stack>
                  <Text className="text-green-500 text-xl">
                    The answer is {question?.a}
                  </Text>
                  <Text className="text-gray-500">Your answer is {value}</Text>
                </Stack>
              </Stack>
            </Card>
            <div>
              <Button
                fullWidth
                variant="filled"
                color="red"
                size="lg"
                onClick={next}
                disabled={!value}
                component={Link}
                rightIcon={<ArrowRight size={18} />}
                href={{
                  pathname,
                  query: {
                    ...query,
                    question_number: Number(query.question_number) + 1,
                  },
                }}
              >
                Next
              </Button>
            </div>
          </Stack>
        ) : (
          <form onSubmit={checkAnswer}>
            <Stack>
              <Card className="bg-gray-100 w-full" shadow="xl" padding={40}>
                <Stack>
                  <Title align="center">{question?.q}</Title>
                  <TextInput
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter your answer"
                    classNames={{ label: "text-gray-500 text-xs" }}
                    styles={{
                      input: {
                        border: "none",
                        borderRadius: "0",
                        background: "transparent",
                        borderBottom: "1px solid #E0E3EA",
                        color: "#100C2A",
                        fontSize: "18px",
                        fontWeight: 300,
                        height: "48px",
                        padding: "0",
                        "&:focus": {
                          borderBottom: "1.5px solid #3b82f680",
                          color: "#100C2A",
                          fontSize: "18px",
                          fontWeight: 300,
                          outline: "none",
                        },
                      },
                    }}
                  />
                </Stack>
              </Card>
              <div>
                <Button
                  fullWidth
                  variant="filled"
                  color="blue"
                  size="lg"
                  disabled={!value}
                  type="submit"
                >
                  Check
                </Button>
              </div>
            </Stack>
          </form>
        )}
        <Button
          variant="white"
          className="font-normal"
          component={Link}
          href="/"
        >
          Return Home
        </Button>
      </Stack>
    </Container>
  );
}

function NoQuestionCard() {
  return (
    <Container size="sm" className="flex justify-center">
      <Card className="bg-gray-50 w-full" padding="xl" shadow="xl">
        <Stack className="text-center">
          <Text>Nothing to see here ):</Text>
          <Book1 variant="TwoTone" size={80} className="mx-auto" />
          <Button
            variant="white"
            className="font-normal"
            component={Link}
            href="/"
          >
            Return Home
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}

function randomNoRepeats(array: { q: string; a: string }[]) {
  var copy = array.slice(0);
  return function () {
    if (copy.length < 1) {
      copy = array.slice(0);
    }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}
