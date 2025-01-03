'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type FinancialTopic = {
  id: string
  title: string
  content: string
}

export function FinancialEducation() {
  const [topics, setTopics] = useState<FinancialTopic[]>([
    {
      id: '1',
      title: 'Budgeting Basics',
      content: 'Budgeting is the process of creating a plan to spend your money. This spending plan is called a budget. Creating this spending plan allows you to determine in advance whether you will have enough money to do the things you need to do or would like to do.'
    },
    {
      id: '2',
      title: 'Understanding Credit Scores',
      content: 'A credit score is a number that represents your creditworthiness. It's based on your credit history and is used by lenders to determine how likely you are to repay a loan. The higher your score, the better your chances of getting approved for loans with favorable terms.'
    },
    {
      id: '3',
      title: 'Investing for Beginners',
      content: 'Investing is the act of allocating resources, usually money, with the expectation of generating an income or profit. You can invest in endeavors, such as using money to start a business, or in assets, such as purchasing real estate in hopes of reselling it later at a higher price.'
    },
  ])
  const [newTopic, setNewTopic] = useState({ title: '', content: '' })

  const addTopic = () => {
    if (newTopic.title && newTopic.content) {
      setTopics([...topics, { ...newTopic, id: Date.now().toString() }])
      setNewTopic({ title: '', content: '' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Education</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {topics.map((topic) => (
            <AccordionItem key={topic.id} value={topic.id}>
              <AccordionTrigger>{topic.title}</AccordionTrigger>
              <AccordionContent>{topic.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Add New Topic</h3>
          <div>
            <Label htmlFor="topic-title">Title</Label>
            <Input
              id="topic-title"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
              placeholder="Enter topic title"
            />
          </div>
          <div>
            <Label htmlFor="topic-content">Content</Label>
            <Input
              id="topic-content"
              value={newTopic.content}
              onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
              placeholder="Enter topic content"
            />
          </div>
          <Button onClick={addTopic}>Add Topic</Button>
        </div>
      </CardContent>
    </Card>
  )
}

