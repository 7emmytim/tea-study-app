import { sermons } from "@/data";
import {
  Button,
  Card,
  Container,
  Group,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AddCircle, ArrowRight, TickCircle } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

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
      <Group>
        {sermons.map((item, index) => {
          const color = Math.floor(Math.random() * 16777215).toString(16);
          return (
            <Card
              key={index}
              className="bg-gray-100"
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
                <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-white text-white flex-shrink-0">
                  <item.icon size={20} variant="Bold" style={{ color }} />
                </div>
                <Stack spacing={1}>
                  <Text className="text-gray-900 text-lg title-font font-medium">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-xs">
                    {item.description}
                  </Text>
                </Stack>
              </Group>
            </Card>
          );
        })}
      </Group>
    </Container>
  );
}

function Questions() {
  const [value, setValue] = useState("");
  const [score, setScore] = useState(0);
  const [answerStatus, setAnswerStatus] = useState("");
  const { pathname, query } = useRouter();
  const { sermon, question_number = 0 } = query;
  const details = sermons.find((item) => item.slug === sermon);
  const questions = sermons.find((item) => item.slug === sermon)?.questions?.[
    Number(question_number) - 1
  ];
  const options = [questions?.a, ...(questions?.options || [])];

  function checkAnswer() {
    if (value === questions?.a) {
      setScore((prev) => prev + 1);
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("failed");
    }
  }

  function next() {
    setAnswerStatus("");
    setValue("");
  }

  return (
    <Container className="flex justify-center w-full">
      <Stack className="w-full">
        <Stack spacing={1}>
          <Title order={3}>
            {details?.title}
            <Text className="text-gray-500 text-xs font-normal">
              ({`${details?.description} - Question ${question_number}`})
            </Text>
          </Title>
          <Text className="text-sm text-purple-900 font-semibold text-right">
            Current Score: {score}
          </Text>
        </Stack>
        <Card className="bg-gray-100 w-full" shadow="xl" padding="xl">
          <Radio.Group
            value={value}
            onChange={setValue}
            name={`${sermon} ${question_number}`}
            label={questions?.q}
            description="Select a correct answer"
            className="space-y-4"
            classNames={{
              label: "text-lg font-bold",
            }}
          >
            {options.map((item) => {
              return (
                <Group key={item}>
                  <Radio
                    size="sm"
                    disabled={Boolean(answerStatus)}
                    value={item}
                    label={item}
                  />
                  {answerStatus === "correct" && item === questions?.a && (
                    <TickCircle color="green" variant="Bold" />
                  )}
                  {answerStatus === "failed" && item === value && (
                    <AddCircle
                      color="red"
                      variant="Bold"
                      className="rotate-45"
                    />
                  )}
                </Group>
              );
            })}
          </Radio.Group>
        </Card>
        <div>
          {answerStatus ? (
            <Button
              fullWidth
              variant="filled"
              color={answerStatus === "correct" ? "green" : "red"}
              size="xl"
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
          ) : (
            <Button
              fullWidth
              variant="filled"
              color="blue"
              size="xl"
              disabled={!value}
              onClick={checkAnswer}
            >
              Check
            </Button>
          )}
        </div>
      </Stack>
    </Container>
  );
}
